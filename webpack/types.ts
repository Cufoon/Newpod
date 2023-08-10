import type { Configuration, ModuleOptions } from 'webpack';

export type LoadersType = NonNullable<ModuleOptions['rules']>;
export type OptimizationType = Configuration['optimization'];
export type PluginsType = NonNullable<Configuration['plugins']>;
