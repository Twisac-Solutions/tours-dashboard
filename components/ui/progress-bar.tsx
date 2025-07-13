interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  unit: string;
}

export function ProgressBar({ label, value, max, unit }: ProgressBarProps) {
  const percentage = (value / max) * 100;

  return (
    <li>
      <p className="flex justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="font-medium text-muted-foreground">
          {value}
          <span className="font-normal text-muted-foreground">
            /{max}
            {unit}
          </span>
        </span>
      </p>
      <div className="flex w-full items-center mt-2 [&>*]:h-1.5">
        <div
          className="relative flex h-2 w-full items-center rounded-full bg-primary/10"
          aria-label="progress bar"
          aria-valuenow={value}
          aria-valuemax={max}
        >
          <div
            className="h-full flex-col rounded-full bg-primary"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </li>
  );
}
