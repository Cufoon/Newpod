import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  Method,
  RawAxiosRequestHeaders
} from 'axios';
import qs from 'qs';

export type Return<T> = Promise<[data: T | undefined, err?: string]>;

interface Options {
  withoutToken?: boolean;
  abortSignal?: AbortSignal;
  headers?: RawAxiosRequestHeaders;
}

export async function request<T, U>(
  url: string,
  method: Method,
  data?: T,
  option?: Options
): Return<U> {
  try {
    const options: AxiosRequestConfig<T> = {
      url,
      method,
      headers: { ...(option?.headers as RawAxiosRequestHeaders) }
    };
    if (!option?.withoutToken) {
      options.headers = {
        Authorization: 'something'
      } as RawAxiosRequestHeaders;
    }
    if (option?.abortSignal) {
      options.signal = option.abortSignal;
    }
    if (data) {
      options.data = data;
    }
    const res = await axios<U, AxiosResponse<U, T>, T>(options);

    if (process.env.NODE_ENV === 'development') {
      console.group('Request to ', url);
      console.log('send_data', data);
      console.log('get_header', res.headers);
      console.log('get_body ', res.data);
      console.groupEnd();
    }

    if (res.status < 200 || res.status >= 300) {
      return [undefined, res.statusText];
    }
    return [res.data];
  } catch (e: unknown) {
    console.log('请求意外错误', e);
    return [undefined, (e as Error).toString()];
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function requestGet<U = any>(url: string): Return<U> {
  return await request<unknown, U>(url, 'GET');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function requestGetWithParam<T = any, U = any>(
  url: string,
  data: T
): Return<U> {
  const query = qs.stringify(data);
  return await request<T, U>(`${url}?${query}`, 'GET');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function requestGetWithData<T = any, U = any>(
  url: string,
  data: T
): Return<U> {
  return await request<T, U>(url, 'GET', data);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function requestPost<T = any, U = any>(
  url: string,
  data: T,
  option?: Options
): Return<U> {
  return await request<T, U>(url, 'POST', data, option);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function requestPut<T = any, U = any>(
  url: string,
  data: T
): Return<U> {
  return await request<T, U>(url, 'PUT', data);
}
