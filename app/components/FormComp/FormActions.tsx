"use client";

type FormActionsProps = {
  isLoading?: boolean;
  onReset: () => void;
  onSubmit: () => void;
};

export default function FormActions({
  isLoading = false,
  onReset,
  onSubmit,
}: FormActionsProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
      <div className="px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-400 text-center sm:text-left">
          Please review all sections before submitting. Fields marked{" "}
          <span className="text-red-500 font-semibold">*</span> are required.
        </p>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onReset}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset All
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 transition-colors shadow-sm shadow-blue-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Submitting…
              </>
            ) : (
              "Submit Application"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
