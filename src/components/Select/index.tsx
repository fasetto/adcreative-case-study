import { tv } from "tailwind-variants";
import RASelect, {
  components,
  type DropdownIndicatorProps,
  type MultiValueGenericProps,
  type MultiValueRemoveProps,
  type OptionProps,
} from "react-select";

import type { Character } from "../../types";
import ChevronDownIcon from "../../icons/ChevronDown";
import CrossIcon from "../../icons/CrossIcon";

const styles = tv({
  slots: {
    base: ["w-full max-w-96"],
    listbox: [
      "border-solid border-2 border-primary-600 rounded-xl",
      "min-h-16 divide-y-2 divide-primary-600",
    ],
    control: [
      "hover:cursor-text font-medium",
      "border-solid border-2 border-primary-600 rounded-xl",
      "p-2 pr-4",
    ],
    noOptions: ["min-h-16 grid place-items-center", "text-primary-700"],
    multiValue: [
      "bg-primary-100 rounded-lg py-1 px-2 text-primary-900 text-sm",
      "flex items-center gap-2 select-none cursor-default",
    ],
    multiRemove: [
      "bg-[#94a3b8] text-white rounded-md",
      "w-6 h-6 flex items-center justify-center",
      "hover:bg-primary-700/80 transition",
    ],
    option: [
      "px-2 py-3 flex items-center gap-2",
      "data-[focused]:bg-blue-100/90",
    ],
    checkbox: [
      "rounded-md border-solid border-2 border-[#7b7b7b] transition",
      "w-5 h-5 flex items-center justify-center",
      "selected:text-white selected:bg-[#0275ff] selected:border-[#0275ff]",
    ],
    nameStyles: [
      "text-primary-800/90 text-lg font-medium [&_strong]:font-bold [&_strong]:text-primary-900",
    ],
    episodes: ["text-base text-primary-700 font-medium"],
    imageStyles: ["aspect-square w-12 h-full object-cover rounded-xl shrink-0"],
  },
});

const {
  base,
  option,
  listbox,
  control,
  noOptions,
  multiValue,
  multiRemove,
  checkbox,
  nameStyles,
  imageStyles,
  episodes,
} = styles();

interface SelectProps<T extends Character> {
  className?: string;
  items: T[];
  isLoading?: boolean;
  placeholder: string;
  onSearch: (searchTerm: string) => void;
  onScrollToBottom?: () => void;
}

export default function Select<T extends Character>({
  className,
  items,
  isLoading,
  placeholder,
  onSearch,
  onScrollToBottom,
}: SelectProps<T>) {
  return (
    <RASelect
      unstyled
      name="characters"
      aria-label={placeholder}
      placeholder={placeholder}
      options={items}
      getOptionLabel={(op) => op.name}
      getOptionValue={(op) => op.id.toString()}
      onInputChange={onSearch}
      maxMenuHeight={574}
      isLoading={isLoading}
      noOptionsMessage={() => "Nothing found"}
      isClearable={false}
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      onMenuScrollToBottom={onScrollToBottom}
      classNames={{
        control: () => control(),
        container: () => base({ className }),
        menuList: () => listbox(),
        placeholder: () => "text-primary-900/60",
        menu: () => "mt-3",
        noOptionsMessage: () => noOptions(),
        loadingMessage: () => noOptions(),
        multiValue: () => multiValue(),
        multiValueRemove: (props) =>
          multiRemove({
            className: props.isFocused && ["ring ring-black"],
          }),
        valueContainer: () => "flex gap-2 min-h-[32px]",
        dropdownIndicator: () => "text-primary-800 w-4",
        loadingIndicator: () => "text-primary-800",
      }}
      components={{
        Option,
        DropdownIndicator,
        MultiValueLabel,
        MultiValueRemove,
      }}
      isMulti
    />
  );
}

function Option({ children, ...props }: OptionProps<Character, true>) {
  const { name, image, episode } = props.data;

  return (
    <components.Option {...props}>
      <div data-focused={props.isFocused ? "true" : null} className={option()}>
        <div
          data-selected={props.isSelected ? "true" : null}
          className={checkbox()}
        >
          {props.isSelected && (
            <svg
              viewBox="0 0 18 18"
              aria-hidden="true"
              fill="none"
              strokeWidth={3}
            >
              <polyline stroke="white" points="1 9 7 14 15 4" />
            </svg>
          )}
        </div>
        <img src={image} className={imageStyles()} />

        <div className="flex flex-col">
          <div
            className={nameStyles()}
            dangerouslySetInnerHTML={{ __html: name }}
          />
          <div className={episodes()}>{episode.length} Episodes</div>
        </div>
      </div>
    </components.Option>
  );
}

function DropdownIndicator(props: DropdownIndicatorProps<Character, true>) {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDownIcon
        data-focused={props.selectProps.menuIsOpen ? "true" : null}
        className="data-[focused=true]:rotate-180"
      />
    </components.DropdownIndicator>
  );
}

function MultiValueRemove(props: MultiValueRemoveProps<Character, true>) {
  return (
    <components.MultiValueRemove {...props}>
      <div className={multiRemove()} onFocus={console.log}>
        <CrossIcon className="text-white w-5 h-5" />
      </div>
    </components.MultiValueRemove>
  );
}

function MultiValueLabel({
  children,
  ...props
}: MultiValueGenericProps<Character, true>) {
  return (
    <components.MultiValueLabel {...props}>
      {(children as string)
        .replace(/<strong>/gi, "")
        .replace(/<\/strong>/gi, "")}
    </components.MultiValueLabel>
  );
}
