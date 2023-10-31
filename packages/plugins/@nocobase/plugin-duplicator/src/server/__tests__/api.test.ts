import { MockServer } from '@nocobase/test';
import path from 'path';
import os from 'os';
import fs from 'fs';
import createApp from './index';

describe('duplicator api', () => {
  let app: MockServer;

  beforeEach(async () => {
    app = await createApp();
  });

  afterEach(async () => {
    await app.destroy();
  });

  it('should request dump and restore api', async () => {
    const dumpResponse = await app.agent().post('/duplicator:dump').send({});

    expect(dumpResponse.status).toBe(200);
    // should response file name
    const headers = dumpResponse.headers;
    expect(headers['content-disposition']).toBeTruthy();
    const filePath = path.resolve(os.tmpdir(), 'dump.nbdump');

    fs.writeFileSync(filePath, dumpResponse.body);

    const packageInfoResponse = await app.agent().post('/duplicator:upload').attach('file', filePath);

    expect(packageInfoResponse.status).toBe(200);
    const data = packageInfoResponse.body.data;

    expect(data['key']).toBeTruthy();
    expect(data['meta']).toBeTruthy();

    const restoreResponse = await app.agent().post('/duplicator:restore').send({
      restoreKey: data['key'],
      dataTypes: data['meta']['dataTypes'],
    });

    expect(restoreResponse.status).toBe(200);
  });

  it('should get dumpable collections', async () => {
    const response = await app.agent().get('/duplicator:dumpableCollections');

    expect(response.status).toBe(200);

    const body = response.body;

    expect(body['meta']).toBeTruthy();
    expect(body['config']).toBeTruthy();
    expect(body['business']).toBeTruthy();
    console.log(JSON.stringify(body, null, 2));
  });
});
