import React from "react";
import Loader from "./ui/Loader/Loader";
import Address from "./components/Address/Address"; 
import AddressBook from "./components/AddressBook/AddressBook";
import Button from "./ui/Button/Button";
import Radio from "./ui/Radio/Radio";
import Section from "./ui/Section/Section";
import useAddressBook from "src/hooks/useAddressBook";
import useFormFields from "./hooks/useFormFields"; 
import ErrorMessage from "./ui/ErrorMessage/ErrorMessage"; 
import Form from "./ui/Form/Form";
import { Address as AddressType } from "./types";
import styles from "./App.module.css";

const API_BASE =
  process.env.NEXT_PUBLIC_URL ??
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

const S = (v: unknown) => (v == null ? "" : String(v).trim());

// Normalize address object from API/mock
const transformAddress = (addr: any, houseNumber: string, index: number): AddressType => {
  const streetRaw = S(addr.street ?? addr.line1);
  const city = S(addr.city);
  const postcode = S(addr.postcode ?? addr.postCode);
  const hn = S(addr.houseNumber);

  // avoid duplicated house number in street
  let street = streetRaw;
  const id = `${postcode}-${streetRaw}-${hn}`;
  return { id, street, city, postcode, houseNumber: hn } as AddressType;
};

function App() {
  const { fields, setFields, onChange, reset } = useFormFields({
    postCode: "",
    houseNumber: "",
    firstName: "",
    lastName: "",
    selectedAddress: "",
  });
  const { postCode, houseNumber, firstName, lastName, selectedAddress } = fields;

  const [error, setError] = React.useState<string | undefined>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);
  const [loading, setLoading] = React.useState(false);
  const { addAddress } = useAddressBook();

  // ---- Validations
  const isDigits = (v: string) => /^[0-9]+$/.test(v);

  // ---- Fetch addresses
  const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    setAddresses([]);
    setFields({ postCode, houseNumber, firstName, lastName, selectedAddress: "" });

    // validations for "Find an Address"
    if (!postCode || !houseNumber) return setError("Please enter both Post Code and House number.");
    if (postCode.length < 4 || postCode.length > 10) return setError("Postcode Enter Valid Postcode!");
    if (!isDigits(postCode)) return setError("Postcode must be all digits and non negative!");
    if (!isDigits(houseNumber)) return setError("Street Number must be all digits and non negative!");

    setLoading(true);
    try {
      const url = `${API_BASE}/api/getAddresses?postcode=${encodeURIComponent(postCode.trim())}&streetnumber=${encodeURIComponent(houseNumber.trim())}`;
      const res = await fetch(url);

      if (!res.ok) {
        let message = "Failed to fetch addresses";
        try {
          const errData = await res.json();
          message = errData?.message || errData?.errormessage || message;
        } catch {
          const text = await res.text();
          if (text) message = text;
        }
        throw new Error(message);
      }

      const data = await res.json();
      console.log("🚀 ~ handleAddressSubmit ~ data:", data)
      const list: any[] = Array.isArray(data) ? data : data?.details ?? [];
      console.log("🚀 ~ handleAddressSubmit ~ list:", list)
      console.log("🚀 ~ handleAddressSubmit ~ list:", list.map((a, i) => transformAddress(a, a.houseNumber, i)))
      setAddresses(list.map((a, i) => transformAddress(a, houseNumber.trim(), i)));
    } catch (err: any) {
      setError(err?.message || "Something went wrong while fetching addresses.");
    } finally {
      setLoading(false);
    }
  };

  // ---- Add person to selected address
  const handlePersonSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    // ---- Validations
  const isDigits = (v: string) => /^[0-9]+$/.test(v);

  // Letters-only (with accents), spaces, hyphen, apostrophe, dot.
  // - at least 2 chars, max 50
  // - must start/end with a letter
  const isValidName = (v: string) => {
    const s = (v ?? "").trim();
    if (s.length < 2 || s.length > 50) return false;
    if (/\d/.test(s)) return false; // block any number
    return /^[\p{L}\p{M}][\p{L}\p{M}'’.\- ]*[\p{L}\p{M}]$/u.test(s);
  };

  // Optional: normalize internal spacing
  const normalizeSpace = (s: string) => s.trim().replace(/\s+/g, " ");

  e.preventDefault();
  setError(undefined);

  // required fields
  if (!firstName.trim() || !lastName.trim())
    return setError("First name and last name fields mandatory!");
  if (!selectedAddress || !addresses.length)
    return setError("No address selected, try to select an address or find one if you haven't");

  // name validation (no numbers, letters only with common punctuation)
  if (!isValidName(firstName)) return setError("Enter a valid first name (letters only).");
  if (!isValidName(lastName))  return setError("Enter a valid last name (letters only).");

  const found = addresses.find(a => a.id === selectedAddress);
  if (!found) return setError("Selected address not found");

  // save normalized names
  const cleanFirst = normalizeSpace(firstName);
  const cleanLast  = normalizeSpace(lastName);

  addAddress({
    ...found,
    firstName: cleanFirst,
    lastName: cleanLast,
  });

  setFields({ postCode: "", houseNumber: "", firstName: "", lastName: "", selectedAddress: "" });
  };

  // ---- Clear all
  const clearAll = () => {
    reset();
    setAddresses([]);
    setError(undefined);
  };

  return (
    <main>
      <div className={styles["address-layout"]}>
        <Section>
          <h1>
            Create your own address book!
            <br />
            <small>Enter an address by postcode add personal info and done! 👏</small>
          </h1>

          {/* Find an Address */}
          <Form
            label="🏠 Find an address"
            loading={loading}
            submitText="Find"
            onFormSubmit={handleAddressSubmit}
            formEntries={[
              { name: "postCode", placeholder: "Post Code", extraProps: { value: postCode, onChange } },
              { name: "houseNumber", placeholder: "House number", extraProps: { value: houseNumber, onChange } },
            ]}
          />
        {loading && <Loader text="Loading addresses…" />}
          {/* Search Results */}
          {addresses.length > 0 &&
            addresses.map((a) => (
              <Radio
                key={a.id}
                id={a.id}
                name="selectedAddress"
                value={a.id}
                checked={selectedAddress === a.id}
                onChange={onChange}
              >
                {/* Make sure your <Address /> prints only truthy parts */}
                {/* e.g., [line1, a.postcode, a.city].filter(Boolean).join(", ") */}
                <Address {...a} />
              </Radio>
            ))}

          {/* Add Personal Info */}
          {selectedAddress && (
            <Form
              label="✏️ Add personal info to address"
              submitText="Add to addressbook"
              onFormSubmit={handlePersonSubmit}
              formEntries={[
                { name: "firstName", placeholder: "First name", extraProps: { value: firstName, onChange } },
                { name: "lastName", placeholder: "Last name", extraProps: { value: lastName, onChange } },
              ]}
            />
          )}

          {/* Error */}
          <ErrorMessage>{error}</ErrorMessage>

          {/* Clear all fields — secondary look */}
          <div style={{ marginTop: "1rem" }}>
            <Button type="button" variant="secondary" onClick={clearAll}>
              Clear all fields
            </Button>
          </div>
        </Section>

          <AddressBook />
      </div>
    </main>
  );
}

export default App;
