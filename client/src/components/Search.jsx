import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { debounce } from 'lodash';

const SearchFilter = ({ categories = [], names = [], onSearchChange, onCategoryChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filteredCategories, setFilteredCategories] = useState(categories);
    const [filteredNames, setFilteredNames] = useState(names);

    // This effect will only update when `searchTerm`, `categories`, or `names` change.
    useEffect(() => {
        const filteredCats = categories.filter(category =>
            category.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const filteredNms = names.filter(name =>
            name.label.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Only update if the filtered data has changed
        if (
            filteredCats.length !== filteredCategories.length ||
            filteredNms.length !== filteredNames.length ||
            !filteredCats.every((cat, index) => cat.label === filteredCategories[index]?.label) ||
            !filteredNms.every((nm, index) => nm.label === filteredNames[index]?.label)
        ) {
            setFilteredCategories(filteredCats);
            setFilteredNames(filteredNms);
        }
    }, [searchTerm, categories, names]);  // Only rerun effect when searchTerm, categories, or names change.

    const handleSearchChange = (inputValue) => {
        setSearchTerm(inputValue); // Only update search term, which triggers filtering.
        onSearchChange(inputValue); // Pass the search value up to parent.
    };

    const handleCategoryChange = (selectedOption) => {
        setSelectedCategory(selectedOption);
        onCategoryChange(selectedOption);
    };

    // Debounced search handler to limit frequency of updates.
    const debouncedSearch = debounce(handleSearchChange, 300);

    return (
        <div className="flex flex-col md:flex-row items-center w-full mt-[15vh]">
            <div className="flex-grow w-full md:w-1/2 lg:w-1/3 mb-4 md:mb-0 md:mr-4">
                <Select
                    options={[...filteredCategories, ...filteredNames]}
                    onInputChange={debouncedSearch} // Use debounced input for the search term
                    onChange={handleCategoryChange} // Regular category change
                    placeholder="Search for products or categories..."
                    isClearable
                    classNamePrefix="react-select"
                />
            </div>
        </div>
    );
};

export default SearchFilter;
