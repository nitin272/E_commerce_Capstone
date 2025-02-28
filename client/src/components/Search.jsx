import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { debounce } from 'lodash';
import { Paper, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

const SearchFilter = ({ categories = [], names = [], onSearchChange, onCategoryChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filteredCategories, setFilteredCategories] = useState(categories);
    const [filteredNames, setFilteredNames] = useState(names);

  
    useEffect(() => {
        const filteredCats = categories.filter(category =>
            category.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const filteredNms = names.filter(name =>
            name.label.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (
            filteredCats.length !== filteredCategories.length ||
            filteredNms.length !== filteredNames.length ||
            !filteredCats.every((cat, index) => cat.label === filteredCategories[index]?.label) ||
            !filteredNms.every((nm, index) => nm.label === filteredNames[index]?.label)
        ) {
            setFilteredCategories(filteredCats);
            setFilteredNames(filteredNms);
        }
    }, [searchTerm, categories, names]);  

    const handleSearchChange = (inputValue) => {
        setSearchTerm(inputValue); 
        onSearchChange(inputValue); 
    };

    const handleCategoryChange = (selectedOption) => {
        setSelectedCategory(selectedOption);
        onCategoryChange(selectedOption);
    };


    const debouncedSearch = debounce(handleSearchChange, 300);

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderRadius: '12px',
            border: 'none',
            boxShadow: state.isFocused ? '0 0 0 2px #2563eb' : '0 1px 3px rgba(0,0,0,0.1)',
            '&:hover': {
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            },
            minHeight: '50px',
            backgroundColor: '#f8fafc',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? '#e5e7eb' : 'white',
            color: state.isSelected ? 'white' : '#374151',
            padding: '12px 16px',
            '&:hover': {
                backgroundColor: state.isSelected ? '#2563eb' : '#e5e7eb',
            },
        }),
        menu: (provided) => ({
            ...provided,
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            zIndex: 1000,
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#64748b',
        }),
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 pt-24">
            <div className="flex flex-col space-y-8 bg-white rounded-2xl p-8 shadow-lg">
                {/* Search Header */}
                <div className="text-center space-y-4">
                    <h2 className="text-4xl font-bold text-gray-800 mb-2 tracking-tight">
                        Find Your Perfect Product
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Browse through our collection or search for specific items
                    </p>
                    <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
                </div>

                {/* Search Bar Container */}
                <div className="flex flex-col md:flex-row items-stretch gap-4">
                    {/* Main Search Input */}
                    <div className="w-full md:w-2/3">
                        <Paper
                            elevation={0}
                            className="flex items-center px-4 py-2 rounded-xl bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300"
                            sx={{
                                border: '1px solid #e5e7eb',
                                '&:hover': {
                                    borderColor: '#2563eb',
                                },
                            }}
                        >
                            <SearchIcon className="text-gray-400 mr-2" />
                            <Select
                                options={[...filteredCategories, ...filteredNames]}
                                onInputChange={debouncedSearch}
                                onChange={handleCategoryChange}
                                placeholder="Search products..."
                                isClearable
                                isSearchable
                                styles={customStyles}
                                className="w-full"
                                components={{
                                    DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                }}
                            />
                        </Paper>
                    </div>

                    {/* Category Filter */}
                    <div className="w-full md:w-1/3">
                        <Paper
                            elevation={0}
                            className="flex items-center px-4 py-2 rounded-xl bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300 h-full"
                            sx={{
                                border: '1px solid #e5e7eb',
                                '&:hover': {
                                    borderColor: '#2563eb',
                                },
                            }}
                        >
                            <FilterListIcon className="text-gray-400 mr-2" />
                            <Select
                                options={categories}
                                onChange={handleCategoryChange}
                                placeholder="Filter by category"
                                isClearable
                                styles={customStyles}
                                className="w-full"
                            />
                        </Paper>
                    </div>
                </div>

                {/* Active Filters Display (if any) */}
                {selectedCategory && (
                    <div className="flex items-center gap-2 mt-4">
                        <span className="text-sm font-medium text-gray-500">Active filters:</span>
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-medium border border-blue-100 hover:bg-blue-100 transition-colors duration-200">
                            {selectedCategory.label}
                            <button
                                onClick={() => handleCategoryChange(null)}
                                className="ml-2 hover:text-blue-800 focus:outline-none"
                                aria-label="Remove filter"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchFilter;
