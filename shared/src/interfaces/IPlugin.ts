export interface IPlugin {
  /**
   * Unique identifier for the plugin.
   */
  id: string;

  /**
   * Human-readable name of the plugin.
   */
  name: string;

  /**
   * Semantic version of the plugin.
   */
  version: string;

  /**
   * Called when the plugin is loaded into the system.
   * @param context System context providing access to OS services.
   */
  onLoad(context: any): Promise<void>;

  /**
   * Called when the plugin is unloaded.
   */
  onUnload(): Promise<void>;

  /**
   * Main execution loop for the plugin, called every tick if registered.
   * @param deltaTimeMs Time elapsed since the last tick in milliseconds.
   */
  onTick?(deltaTimeMs: number): Promise<void>;
}

export interface IPluginManifest {
  id: string;
  name: string;
  version: string;
  entryPoint: string;
  dependencies?: Record<string, string>;
}
