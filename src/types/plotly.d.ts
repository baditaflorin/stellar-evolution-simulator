declare module "plotly.js-dist-min" {
  type PlotlyElement = HTMLElement;
  type PlotlyTrace = Record<string, unknown>;
  type PlotlyLayout = Record<string, unknown>;
  type PlotlyConfig = Record<string, unknown>;

  const Plotly: {
    newPlot(
      element: PlotlyElement,
      data: PlotlyTrace[],
      layout: PlotlyLayout,
      config?: PlotlyConfig,
    ): Promise<unknown>;
    purge(element: PlotlyElement): void;
  };

  export default Plotly;
}
