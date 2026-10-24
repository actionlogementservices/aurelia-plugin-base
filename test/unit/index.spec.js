import { Container } from 'aurelia-dependency-injection';
import { configure, FaceMatchingConfiguration } from '../../src/index';

describe('index', () => {
  test('configure() registers custom elements globally and applies the options', () => {
    const container = new Container();
    const mockAurelia = { container, globalResources: jest.fn(() => {}) };
    configure(mockAurelia, () => ({ serviceBaseUrl: 'https://service.test/' }));
    expect(mockAurelia.globalResources).toHaveBeenCalled();
    const configuration = container.get(FaceMatchingConfiguration);
    expect(configuration.scriptUrl).toBe('https://service.test/contract/signbook/v3/script/signbook.js');
  });

  test('configure() throws when the service base url is not provided', () => {
    const mockAurelia = { container: new Container(), globalResources: jest.fn(() => {}) };
    expect(() => configure(mockAurelia)).toThrow(/serviceBaseUrl/);
    expect(() => configure(mockAurelia, {})).toThrow(/serviceBaseUrl/);
    expect(() => configure(mockAurelia, () => ({}))).toThrow(/serviceBaseUrl/);
    expect(mockAurelia.globalResources).not.toHaveBeenCalled();
  });
});
