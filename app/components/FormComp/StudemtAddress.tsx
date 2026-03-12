import { Label, InputField, SelectField } from "./FormFields";
import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";

const PROVINCES = [
  "Koshi Province",
  "Madhesh Province",
  "Bagmati Province",
  "Gandaki Province",
  "Lumbini Province",
  "Karnali Province",
  "Sudurpashchim Province",
];

const DISTRICTS_BY_PROVINCE: Record<string, string[]> = {
  "Koshi Province": [
    "Taplejung",
    "Panchthar",
    "Ilam",
    "Jhapa",
    "Morang",
    "Sunsari",
    "Dhankuta",
    "Terhathum",
    "Sankhuwasabha",
    "Bhojpur",
    "Solukhumbu",
    "Okhaldhunga",
    "Khotang",
    "Udayapur",
  ],
  "Madhesh Province": [
    "Saptari",
    "Siraha",
    "Dhanusha",
    "Mahottari",
    "Sarlahi",
    "Rautahat",
    "Bara",
    "Parsa",
  ],
  "Bagmati Province": [
    "Sindhupalchok",
    "Rasuwa",
    "Nuwakot",
    "Dhading",
    "Kathmandu",
    "Bhaktapur",
    "Lalitpur",
    "Kavrepalanchok",
    "Makwanpur",
    "Ramechhap",
    "Dolakha",
    "Sindhuli",
  ],
  "Gandaki Province": [
    "Manang",
    "Mustang",
    "Myagdi",
    "Kaski",
    "Lamjung",
    "Tanahu",
    "Nawalpur",
    "Gorkha",
    "Syangja",
    "Parbat",
    "Baglung",
  ],
  "Lumbini Province": [
    "Rukum (East)",
    "Rolpa",
    "Pyuthan",
    "Gulmi",
    "Palpa",
    "Arghakhanchi",
    "Kapilvastu",
    "Rupandehi",
    "Nawalparasi (East)",
    "Dang",
    "Banke",
    "Bardiya",
  ],
  "Karnali Province": [
    "Dolpa",
    "Mugu",
    "Humla",
    "Jumla",
    "Kalikot",
    "Dailekh",
    "Jajarkot",
    "Rukum (West)",
    "Salyan",
    "Surkhet",
  ],
  "Sudurpashchim Province": [
    "Bajura",
    "Bajhang",
    "Darchula",
    "Baitadi",
    "Dadeldhura",
    "Doti",
    "Achham",
    "Kailali",
    "Kanchanpur",
  ],
};

const MUNICIPALITIES_BY_DISTRICT: Record<string, string[]> = {
  Kathmandu: [
    "Kathmandu Metropolitan City",
    "Kirtipur Municipality",
    "Shankharapur Municipality",
    "Budhanilkantha Municipality",
    "Tokha Municipality",
    "Tarakeshwar Municipality",
    "Chandragiri Municipality",
    "Nagarjun Municipality",
    "Kageshwori Manohara Municipality",
    "Gokarneshwar Municipality",
  ],
  Lalitpur: [
    "Lalitpur Metropolitan City",
    "Godawari Municipality",
    "Mahalaxmi Municipality",
    "Konjyosom Rural Municipality",
    "Bagmati Rural Municipality",
  ],
  Bhaktapur: [
    "Bhaktapur Municipality",
    "Changunarayan Municipality",
    "Madhyapur Thimi Municipality",
    "Suryabinayak Municipality",
  ],
  Kaski: [
    "Pokhara Metropolitan City",
    "Annapurna Rural Municipality",
    "Machhapuchchhre Rural Municipality",
    "Madi Rural Municipality",
    "Rupa Rural Municipality",
  ],
};

type AddressBlock = {
  country: string;
  province: string;
  district: string;
  municipality: string;
  wardNumber: string;
  locality: string;
};

type AddressFields = {
  permanent: AddressBlock;
  temporary: AddressBlock;
  sameAsPermanent: boolean;
};

type AddressErrors = {
  permanent: Partial<AddressBlock>;
  temporary: Partial<AddressBlock>;
};

export type { AddressFields };

const emptyBlock = (): AddressBlock => ({
  country: "Nepal",
  province: "",
  district: "",
  municipality: "",
  wardNumber: "",
  locality: "",
});

function AddressBlockForm({
  data,
  errors,
  showCountry = false,
  onChange,
}: {
  data: AddressBlock;
  errors: Partial<AddressBlock>;
  showCountry?: boolean;
  onChange: (updated: Partial<AddressBlock>) => void;
}) {
  const districts = data.province
    ? (DISTRICTS_BY_PROVINCE[data.province] ?? [])
    : [];
  const municipalities = data.district
    ? (MUNICIPALITIES_BY_DISTRICT[data.district] ?? [])
    : [];

  return (
    <div className="space-y-4">
      {showCountry && (
        <div className="max-w-[180px]">
          <Label required>Country</Label>
          <SelectField
            placeholder="Select Country"
            options={["Nepal"]}
            value={data.country}
            error={errors.country}
            onChange={(val) => onChange({ country: val })}
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label required>Province</Label>
          <SelectField
            placeholder="Select Province"
            options={PROVINCES}
            value={data.province}
            error={errors.province}
            onChange={(val) =>
              onChange({ province: val, district: "", municipality: "" })
            }
          />
        </div>
        <div>
          <Label required>District</Label>
          <SelectField
            placeholder="Select District"
            options={districts}
            value={data.district}
            error={errors.district}
            disabled={!data.province}
            onChange={(val) => onChange({ district: val, municipality: "" })}
          />
        </div>
        <div>
          <Label required>Municipality/VDC</Label>
          <SelectField
            placeholder="Select Municipality/VDC"
            options={
              municipalities.length > 0
                ? municipalities
                : data.district
                  ? [`${data.district} Municipality`]
                  : []
            }
            value={data.municipality}
            error={errors.municipality}
            disabled={!data.district}
            onChange={(val) => onChange({ municipality: val })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label required>Ward Number</Label>
          <InputField
            placeholder="Ward Number"
            value={data.wardNumber}
            error={errors.wardNumber}
            onChange={(val) => onChange({ wardNumber: val })}
          />
        </div>
        <div>
          <Label required>Village/Tole/Locality/Area</Label>
          <InputField
            placeholder="Village/Tole/Locality/Area"
            value={data.locality}
            error={errors.locality}
            onChange={(val) => onChange({ locality: val })}
          />
        </div>
      </div>
    </div>
  );
}

export type AddressHandle = {
  validate: () => boolean;
  reset: () => void;
};

type AddressProps = {
  onChange?: (data: AddressFields) => void;
};

const Address = forwardRef<AddressHandle, AddressProps>(function Address(
  { onChange },
  ref,
) {
  const [address, setAddress] = useState<AddressFields>({
    permanent: emptyBlock(),
    temporary: emptyBlock(),
    sameAsPermanent: false,
  });

  const [errors, setErrors] = useState<AddressErrors>({
    permanent: {},
    temporary: {},
  });

  const validateBlock = (
    block: AddressBlock,
    key: "permanent" | "temporary",
  ): boolean => {
    const blockErrors: Partial<AddressBlock> = {};
    const required: (keyof AddressBlock)[] = [
      "province",
      "district",
      "municipality",
      "wardNumber",
      "locality",
    ];
    required.forEach((f) => {
      if (!block[f]) blockErrors[f] = "This field is required";
    });
    setErrors((prev) => ({ ...prev, [key]: blockErrors }));
    return Object.keys(blockErrors).length === 0;
  };

  useImperativeHandle(ref, () => ({
    validate: () => {
      const permanentOk = validateBlock(address.permanent, "permanent");
      const temporaryOk = address.sameAsPermanent
        ? true
        : validateBlock(address.temporary, "temporary");
      return permanentOk && temporaryOk;
    },
    reset: () => {
      setAddress({
        permanent: emptyBlock(),
        temporary: emptyBlock(),
        sameAsPermanent: false,
      });
      setErrors({ permanent: {}, temporary: {} });
    },
  }));

  const updatePermanent = (patch: Partial<AddressBlock>) => {
    setAddress((prev) => {
      const updated = { ...prev.permanent, ...patch };
      return {
        ...prev,
        permanent: updated,
        temporary: prev.sameAsPermanent ? { ...updated } : prev.temporary,
      };
    });
    const keys = Object.keys(patch) as (keyof AddressBlock)[];
    setErrors((prev) => ({
      ...prev,
      permanent: {
        ...prev.permanent,
        ...Object.fromEntries(keys.map((k) => [k, ""])),
      },
    }));
  };

  const updateTemporary = (patch: Partial<AddressBlock>) => {
    setAddress((prev) => ({
      ...prev,
      temporary: { ...prev.temporary, ...patch },
    }));
    const keys = Object.keys(patch) as (keyof AddressBlock)[];
    setErrors((prev) => ({
      ...prev,
      temporary: {
        ...prev.temporary,
        ...Object.fromEntries(keys.map((k) => [k, ""])),
      },
    }));
  };

  const toggleSameAsPermanent = (checked: boolean) => {
    setAddress((prev) => ({
      ...prev,
      sameAsPermanent: checked,
      temporary: checked ? { ...prev.permanent } : emptyBlock(),
    }));
    if (checked) setErrors((prev) => ({ ...prev, temporary: {} }));
  };

  useEffect(() => {
    onChange?.(address);
  }, [address]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
      <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Address</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Fill in all required fields marked with *
          </p>
        </div>
      </div>

      <div className="px-8 py-7 space-y-6">
        <div className="border border-slate-200 shadow-sm rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-700">
            Permanent Address
          </h3>
          <AddressBlockForm
            data={address.permanent}
            errors={errors.permanent}
            showCountry
            onChange={updatePermanent}
          />
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={address.sameAsPermanent}
            onChange={(e) => toggleSameAsPermanent(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-blue-500 accent-blue-500 cursor-pointer"
          />
          <span className="text-sm font-medium text-slate-700">
            Same as Permanent Address
          </span>
        </label>

        <div className="border border-slate-200 shadow-sm rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-700">
            Temporary Address
          </h3>
          {address.sameAsPermanent ? (
            <div className="py-4 text-center text-sm text-slate-400 bg-slate-50 rounded-lg">
              Same as permanent address
            </div>
          ) : (
            <AddressBlockForm
              data={address.temporary}
              errors={errors.temporary}
              onChange={updateTemporary}
            />
          )}
        </div>
      </div>
    </div>
  );
});

export default Address;
