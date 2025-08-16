import React from "react";
import { useAppSelector } from "../../core/store/hooks";
import useAddressBook from "../../hooks/useAddressBook";
import Address from "../Address/Address";
import Button from "../../ui/Button/Button";
import Card from "../../ui/Card/Card";
import $ from "./AddressBook.module.css";
import { selectAddress } from "../../core/reducers/addressBookSlice";

const initialsFrom = (a?: string, b?: string, fallback?: string) => {
  const i = `${(a||"").trim().charAt(0)}${(b||"").trim().charAt(0)}`.toUpperCase();
  return i || (fallback || "🏠").toString().slice(0,2).toUpperCase();
};
const titleOf = (a?: string, b?: string, hn?: string, street?: string) =>
  `${(a||"").trim()} ${(b||"").trim()}`.trim() || `${hn||""} ${street||""}`.trim();

const AddressBook = () => {
  const addresses = useAppSelector(selectAddress);
  const { removeAddress, loadSavedAddresses, loading } = useAddressBook();

  React.useEffect(() => { loadSavedAddresses(); /* eslint-disable-next-line */ }, []);

  // --- SORT: alphabetical by firstName (names first), then lastName, then street
  const sortedAddresses = React.useMemo(() => {
    const collator = new Intl.Collator(undefined, { sensitivity: "base", numeric: true });
    const norm = (s?: string) => (s ?? "").trim();

    return [...addresses].sort((a, b) => {
      const af = norm(a.firstName), bf = norm(b.firstName);
      const aHas = af.length > 0, bHas = bf.length > 0;

      // entries with a firstName come first
      if (aHas !== bHas) return aHas ? -1 : 1;

      // compare by firstName
      const c1 = collator.compare(af, bf);
      if (c1 !== 0) return c1;

      // tie-breakers: lastName, then street
      const c2 = collator.compare(norm(a.lastName), norm(b.lastName));
      if (c2 !== 0) return c2;

      return collator.compare(norm(a.street), norm(b.street));
    });
  }, [addresses]);

  return (
    <section className={$.paper}>
    <header className={$.header}>
      <h2 className={$.title}>
        <span aria-hidden>📓</span> Address book
        <small
          className={$.sortMini}
          title="Sorted A→Z by first name"
          aria-label="Sorted A to Z by first name"
        >
          A→Z
        </small>
      </h2>

      <span className={$.badge}>{addresses.length}</span>
    </header>


      {!loading && (
        <>
          {sortedAddresses.length === 0 && (
            <p className={$.empty}>No addresses yet — add your first one 😉</p>
          )}

          <ul className={$.list}>
            {sortedAddresses.map((a) => {
              const t = titleOf(a.firstName, a.lastName, a.houseNumber, a.street);
              const init = initialsFrom(a.firstName, a.lastName, a.houseNumber);
              return (
                <li key={a.id} className={$.row}>
                  <Card>
                    <div className={$.sheet}>
                      <div className={$.avatar}>{init}</div>
                      <div className={$.text}>
                        <h3 className={$.name}>{t || "Unnamed"}</h3>
                        <div className={$.addr}><Address {...a} /></div>
                      </div>
                      <div className={$.actions}>
                        <Button
                          variant="secondary"
                          onClick={() => removeAddress(a.id)}
                          aria-label={`Remove ${t}`}
                        >
                          <span className={$.trash} aria-hidden>🗑️</span>
                          Remove
                        </Button>
                      </div>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
};

export default AddressBook;
