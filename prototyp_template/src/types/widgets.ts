// Widget and dashboard related types

export interface WidgetConfig {
  id: string;
  title: string;
  type: 'chart' | 'table' | 'stat' | 'list' | 'custom';
  size: 'small' | 'medium' | 'large' | 'full';
  refreshInterval?: number; // in seconds
  dataSource: {
    entity: string;
    filters?: Record<string, unknown>;
    aggregation?: {
      groupBy?: string[];
      functions?: Array<{
        field: string;
        function: 'count' | 'sum' | 'avg' | 'min' | 'max';
        alias?: string;
      }>;
    };
  };
  visualization?: {
    chartType?: 'line' | 'bar' | 'pie' | 'doughnut' | 'area' | 'scatter';
    xAxis?: string;
    yAxis?: string | string[];
    colors?: string[];
    showLegend?: boolean;
    showGrid?: boolean;
  };
  permissions?: EntityPermissions;
}

export interface DashboardConfig {
  id: string;
  title: string;
  description?: string;
  layout: 'grid' | 'flexible' | 'custom';
  widgets: WidgetConfig[];
  permissions?: EntityPermissions;
  refreshInterval?: number;
  allowCustomization?: boolean;
}

export interface EntityPermissions {
  create?: boolean;
  read?: boolean;
  update?: boolean;
  delete?: boolean;
  list?: boolean;
  search?: boolean;
}

export type EntityOperation = 'create' | 'read' | 'update' | 'delete' | 'list' | 'search';
