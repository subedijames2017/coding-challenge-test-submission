import { createMocks } from 'node-mocks-http';
import handler from '../pages/api/getAddresses'; // adjust path if needed

// mock the generator so tests are deterministic
jest.mock('../src/utils/generateMockAddresses', () => ({
  __esModule: true,
  default: jest.fn((postcode: string, street: string) => ([
    { line1: `2 Edward Street ${street}`, city: 'Brisbane', postcode, houseNumber: street }
  ])),
}));

import generateMockAddresses from '../src/utils/generateMockAddresses';

// helper to run the route
const run = async (query: Record<string, any>) => {
  const { req, res } = createMocks({ method: 'GET', query });
  await handler(req as any, res as any);
  return res;
};

describe('GET /api/getAddresses', () => {
  beforeEach(() => jest.clearAllMocks());

  it('400 when postcode or streetnumber missing', async () => {
    const res = await run({});
    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toMatchObject({
      status: 'error',
      errormessage: 'Postcode and street number fields mandatory!',
    });
  });

  it('400 when postcode length invalid (<4 or >10)', async () => {
    const res = await run({ postcode: '123', streetnumber: '5' });
    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toMatchObject({
      status: 'error',
      errormessage: 'Please Enter Valid Postcode!',
    });
  });

  it('400 when postcode has non-digits', async () => {
    const res = await run({ postcode: '12A4', streetnumber: '5' });
    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toMatchObject({
      status: 'error',
      errormessage: 'Postcode must be all digits and non negative!',
    });
  });

  it('400 when streetnumber has non-digits', async () => {
    const res = await run({ postcode: '12345', streetnumber: 'abc' });
    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toMatchObject({
      status: 'error',
      errormessage: 'Street Number must be all digits and non negative!',
    });
  });

  it('coerces array query values (uses first item)', async () => {
    const res = await run({ postcode: ['1234', '9999'], streetnumber: ['7', '8'] });
    expect(res._getStatusCode()).toBe(200);
    expect(generateMockAddresses).toHaveBeenCalledWith('1234', '7');
  });

  it('200 ok with details from generator', async () => {
    const res = await run({ postcode: '4000', streetnumber: '3' });
    const body = res._getJSONData();
    expect(res._getStatusCode()).toBe(200);
    expect(body.status).toBe('ok');
    expect(Array.isArray(body.details)).toBe(true);
    expect(body.details.length).toBeGreaterThan(0);
  });

  it('404 when generator returns falsy', async () => {
    (generateMockAddresses as jest.Mock).mockReturnValueOnce(null);
    const res = await run({ postcode: '4000', streetnumber: '3' });
    expect(res._getStatusCode()).toBe(404);
    expect(res._getJSONData()).toMatchObject({
      status: 'error',
      errormessage: 'No results found!',
    });
  });
});
