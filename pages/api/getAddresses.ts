import type { NextApiRequest, NextApiResponse } from "next";
import generateMockAddresses from "../../src/utils/generateMockAddresses";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { postcode, streetnumber },
  } = req;

  // Coerce query values to strings (Next can pass string | string[])
  const toStr = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v ?? "";

  const postcodeStr = toStr(postcode);
  const streetNumberStr = toStr(streetnumber);

  if (!postcodeStr || !streetNumberStr) {
    return res.status(400).send({
      status: "error",
      // DO NOT MODIFY MSG - used for grading
      errormessage: "Postcode and street number fields mandatory!",
    });
  }

  if (postcodeStr.length < 4 && postcodeStr.length > 10) {
    return res.status(400).send({
      status: "error",
      // DO NOT MODIFY MSG - used for grading
      errormessage: "Please Enter Valid Postcode!",
    });
  }

  /** Validate: all digits and non-negative (no sign, no decimals) */
  const isStrictlyNumeric = (value: string) => /^[0-9]+$/.test(value);

  // DRY: validate both fields using one loop
  const numericChecks: Array<{ label: "Postcode" | "Street Number"; value: string }> = [
    { label: "Postcode", value: postcodeStr },
    { label: "Street Number", value: streetNumberStr },
  ];

  for (const { label, value } of numericChecks) {
    if (!isStrictlyNumeric(value)) {
      return res.status(400).send({
        status: "error",
        errormessage: `${label} must be all digits and non negative!`,
      });
    }
  }

  const mockAddresses = generateMockAddresses(postcodeStr, streetNumberStr);

  if (mockAddresses) {
    // delay the response by 500ms - for loading status check
    await new Promise((resolve) => setTimeout(resolve, 500));
    return res.status(200).json({
      status: "ok",
      details: mockAddresses,
    });
  }

  return res.status(404).json({
    status: "error",
    // DO NOT MODIFY MSG - used for grading
    errormessage: "No results found!",
  });
}
