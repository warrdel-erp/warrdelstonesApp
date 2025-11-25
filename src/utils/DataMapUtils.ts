export class DataMapUtils {
  static objectToParams = (object?: Object): Record<string, any> => {
    if (!object || typeof object !== 'object') {
      return {};
    }

    const params: Record<string, any> = {};

    Object.entries(object).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params[key] = value;
      }
    });

    return params;
  };
}
