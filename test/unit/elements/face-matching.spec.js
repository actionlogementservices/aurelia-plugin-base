import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { PLATFORM } from 'aurelia-pal';
import { FaceMatchingConfiguration } from 'core/face-matching-configuration';

const flush = (delay = 10) => new Promise(resolve => setTimeout(resolve, delay));

/** Fake service provider script keeping track of its instances. */
class FakeServiceScript {
  static instances = [];
  constructor(parameters) {
    this.parameters = parameters;
    this.destroy = jest.fn();
    FakeServiceScript.instances.push(this);
  }
}

describe('face-matching element', () => {
  let component;
  let context;

  beforeEach(async () => {
    FakeServiceScript.instances = [];
    globalThis.NthSignbook = FakeServiceScript;
    context = { token: 'token-1', options: { lang: 'en' }, onClientFile: jest.fn(), onError: jest.fn() };
    component = StageComponent.withResources(PLATFORM.moduleName('elements/face-matching/face-matching'))
      .inView(
        `<face-matching token.bind="token" options.bind="options"
          client-file-event.delegate="onClientFile($event.detail)"
          error-event.delegate="onError($event.detail)"></face-matching>`
      )
      .boundTo(context);
    component.bootstrap(aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.get(FaceMatchingConfiguration).configure({ serviceBaseUrl: 'https://service.test/' });
    });
    await component.create(bootstrap);
    await flush();
  });

  afterEach(() => {
    component?.dispose();
    component = undefined;
    delete globalThis.NthSignbook;
  });

  it('creates the face matching on the iframe with token and options', () => {
    expect(FakeServiceScript.instances).toHaveLength(1);
    const { parameters } = FakeServiceScript.instances[0];
    const iframe = document.querySelector('iframe');
    expect(parameters.iframeSelectorId).toBe(iframe.id);
    expect(parameters.token).toBe('token-1');
    expect(parameters.url).toBe('https://service.test/contract/signbook/signbook.html');
    expect(parameters.options).toEqual({ renderMode: 'pretty', lang: 'en' });
    expect(iframe.getAttribute('allow')).toBe('microphone *; camera *');
  });

  it('dispatches the iframe messages as DOM events', async () => {
    const { parameters } = FakeServiceScript.instances[0];
    parameters.onClientFileEventMessage({ type: 'clientFileEvent', participantState: 'DONE' });
    parameters.onErrorEventMessage({ type: 'errorEvent', cause: 'SERVER_ERROR' });
    await flush();
    expect(context.onClientFile).toHaveBeenCalledWith({ type: 'clientFileEvent', participantState: 'DONE' });
    expect(context.onError).toHaveBeenCalledWith({ type: 'errorEvent', cause: 'SERVER_ERROR' });
  });

  it('recreates the face matching when the token changes', async () => {
    const first = FakeServiceScript.instances[0];
    component.viewModel.token = 'token-2';
    await flush();
    expect(first.destroy).toHaveBeenCalled();
    expect(FakeServiceScript.instances).toHaveLength(2);
    expect(FakeServiceScript.instances[1].parameters.token).toBe('token-2');
  });

  it('trims the token', async () => {
    component.viewModel.token = ' token-3\n';
    await flush();
    expect(FakeServiceScript.instances.at(-1).parameters.token).toBe('token-3');
  });

  it('destroys the face matching when detached', () => {
    const first = FakeServiceScript.instances[0];
    component.dispose();
    component = undefined;
    expect(first.destroy).toHaveBeenCalled();
  });
});
