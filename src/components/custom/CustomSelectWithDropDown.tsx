"use client";

import React, {useState} from "react";
import {cn} from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select";
import {Input} from "@/components/ui/input";

interface DropdownItem<T = unknown> {
    key: string;
    label: string;
    value: T;
}

interface CustomSelectWithDropDownProps<T = unknown> {
    placeholder?: string;
    isError?: boolean;
    value?: string;
    onChange?: (value: string) => void;
    onBlur?: () => void;
    items: DropdownItem<T>[];
    disabled?: boolean;
    onSearch?: (query: string) => void;
    isSearching?: boolean;
}

const CustomSelectWithDropDown = <T = unknown, >({
                                                     placeholder = "Select an item...",
                                                     isError = false,
                                                     value = "",
                                                     onChange,
                                                     onBlur,
                                                     items,
                                                     disabled = false,
                                                     onSearch,
                                                     isSearching = false,
                                                     ...props
                                                 }: CustomSelectWithDropDownProps<T> & Omit<React.ComponentProps<"div">, keyof CustomSelectWithDropDownProps<T>>) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const handleSelectValue = (selectedKey: string) => {
        onChange?.(selectedKey);
        setIsOpen(false);
        setSearchQuery("");
    };

    // Handle search input changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Call the onSearch callback if provided (for dynamic search)
        if (onSearch && query.length >= 0) { // Can be changed to 3 if needed
            onSearch(query);
        }
    };

    // Find the selected item to display its label
    const selectedItem = items.find(item => {
        if (onSearch) {
            // For dynamic search (like city search), match by extracting the base value
            const itemBaseValue = typeof item.value === 'string' && item.value.includes('__')
                ? item.value.split('__')[0]
                : item.value;
            return itemBaseValue === value;
        } else {
            // For static items, direct match
            return item.value === value;
        }
    });

    // Get the value to use in the Select component
    const selectValue = selectedItem ? selectedItem.value as string : "";

    // For display purposes, show the selected value even if no matching item is found
    const displayValue = selectedItem ? selectedItem.label : (value && onSearch ? value : placeholder);

    return (
        <div className="w-full" {...props}>
            <div
                className={cn(
                    "flex items-center cursor-pointer shadow-md shadow-[#E4E5E73D] !h-[2.5rem] px-3 bg-white rounded-[0.625rem] text-[#0A0D14] text-sm focus:outline-none focus:!ring-0",
                    isError
                        ? "border border-[#DF1C41] focus:border-[#DF1C41]"
                        : "border border-[#E2E4E9] focus:border focus:!border-gray-400",
                    disabled && "opacity-50 cursor-not-allowed"
                )}
            >
                <Select
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    onValueChange={handleSelectValue}
                    value={selectValue}
                    disabled={disabled}
                >
                    <SelectTrigger
                        className="!border-none shadow-none p-0 h-auto w-full bg-transparent !ring-0 focus:ring-0 focus:ring-offset-0"
                        onBlur={onBlur}
                    >
                        <div className={cn(
                            "text-sm w-full text-left",
                            (selectedItem || (value && onSearch)) ? "text-[#0A0D14]" : "text-[#868C98]"
                        )}>
                            {displayValue}
                        </div>
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-lg shadow-lg border border-[#E2E4E9] p-0">
                        <div className="p-2 border-b">
                            <Input
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="h-8 text-sm"
                                autoFocus
                                onKeyDown={(e) => {
                                    // Prevent the Select from closing when typing in search
                                    e.stopPropagation();
                                }}
                                onFocus={(e) => {
                                    // Prevent the Select from handling focus events from search input
                                    e.stopPropagation();
                                }}
                                onBlur={(e) => {
                                    // Prevent the Select from handling blur events from search input
                                    e.stopPropagation();
                                }}
                            />
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                            {isSearching ? (
                                <div className="p-2 text-sm text-gray-500 text-center">
                                    Recherche en cours...
                                </div>
                            ) : items.length === 0 ? (
                                <div className="p-2 text-sm text-gray-500 text-center">
                                    {searchQuery.length > 0 && searchQuery.length < 1 ? "Tapez au moins 1 caractères" : "Aucun élément trouvé"}
                                </div>
                            ) : (
                                items.map((item, index) => (
                                    <SelectItem
                                        key={`${index}-${item.key}`}
                                        value={item.value as string}
                                        className='cursor-pointer hover:bg-gray-50 focus:bg-gray-50 text-[#0A0D14] text-sm'
                                    >
                                        {item.label}
                                    </SelectItem>
                                ))
                            )}
                        </div>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default CustomSelectWithDropDown;
