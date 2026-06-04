type Props = {
  onFile: (file: File) => void;
  accept?: string;
  label?: string;
  busy?: boolean;
  busyLabel?: string;
};

export function UploadButton({
  onFile,
  accept = "image/*",
  label = "Upload",
  busy = false,
  busyLabel = "Loading…",
}: Props) {
  return (
    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-950/50 hover:border-blue-300 dark:hover:border-blue-800 cursor-pointer transition-colors has-disabled:opacity-50 has-disabled:cursor-not-allowed">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 3a1 1 0 0 1 .7.29l4 4a1 1 0 1 1-1.4 1.42L11 6.41V13a1 1 0 1 1-2 0V6.41L6.7 8.71A1 1 0 1 1 5.3 7.29l4-4A1 1 0 0 1 10 3Zm-6 11a1 1 0 0 1 1 1v1h10v-1a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z"
          clipRule="evenodd"
        />
      </svg>
      {busy ? busyLabel : label}
      <input
        type="file"
        accept={accept}
        className="hidden"
        disabled={busy}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          // Reset value so re-selecting the same file fires onChange again
          e.target.value = "";
        }}
      />
    </label>
  );
}
