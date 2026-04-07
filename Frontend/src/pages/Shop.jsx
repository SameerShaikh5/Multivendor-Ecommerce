import { Filter, Search, X } from 'lucide-react'
import React, { useState } from 'react'
import ProductCard from '../components/ProductCard'
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../api/productApi";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef, useEffect } from "react";


const Shop = () => {

    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);


    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["products", { search }],
        queryFn: fetchProducts,

        getNextPageParam: (lastPage) => {
            const current = lastPage.pagination.currentPage;
            const total = lastPage.pagination.totalPages;

            return current < total ? current + 1 : undefined;
        },

        staleTime: 1000 * 60 * 5,
    });

    const products =
        data?.pages
            ?.flatMap((page) => page.data)
            ?.map((product) => ({
                id: product._id,
                name: product.name,
                price: product.price,
                description: product.description,
                category: product.category,
                imageUrl:
                    product.images?.find((img) => img.isThumbnail)?.secure_url ||
                    product.images?.[0]?.secure_url ||
                    "https://placehold.co/400x400",
            })) || [];

    const loadMoreRef = useRef();

    useEffect(() => {
        if (!loadMoreRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 1 }
        );

        observer.observe(loadMoreRef.current);

        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage]);



    const handleFilterToggle = () => {
        setIsOpen(!isOpen)
    }

    const handleSearchInput = (e) => {
        setSearch(e.target.value);
    };


    const handleSearch = (e) => {
        e.preventDefault()
        // call the backend and fetch the data

    }

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name
            .toLowerCase()
            .includes(search.toLocaleLowerCase());

        const matchesCategory =
            selectedCategories.length === 0 ||
            selectedCategories.includes(product.category.toLowerCase());

        return matchesSearch && matchesCategory;
    });


    const handleFilters = (e) => {
        const value = e.target.value.toLowerCase();

        if (e.target.checked) {
            setSelectedCategories(prev => [...prev, value]);
        } else {
            setSelectedCategories(prev =>
                prev.filter(category => category !== value)
            );
        }
    };






    return (
        <>
            {/* <!-- ================= SHOP ================= --> */}
            <main className="max-w-7xl mx-auto px-4 py-12">

                {/* <!-- Header + Search --> */}
                <div className="flex flex-col gap-4 mb-8">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold">Shop</h1>
                            <p className="text-sm text-gray-600">Showing 24 products</p>
                        </div>

                        <div className="flex gap-3">
                            {/* <!-- Search (Desktop) --> */}
                            <div className="hidden sm:flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 gap-2">
                                <Search className="text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="outline-none text-sm w-48"
                                    value={search}
                                    onChange={handleSearchInput}

                                />
                                <button
                                    className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-indigo-700 transition"
                                    onClick={(e) => handleSearch(e)}
                                >
                                    Search
                                </button>
                            </div>

                            {/* <!-- Mobile Filter Button --> */}
                            <button
                                onClick={handleFilterToggle}
                                className="lg:hidden bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
                            >
                                <Filter />
                                Filters
                            </button>
                        </div>
                    </div>

                    {/* <!-- Search (Mobile) --> */}
                    <div className="sm:hidden flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 gap-2">
                        <Search className="text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="outline-none text-sm flex-1"
                            value={search}
                            onChange={handleSearchInput}
                        />
                        <button
                            className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-indigo-700 transition"
                        >
                            Search
                        </button>
                    </div>

                </div>


                <div className="flex gap-8">

                    {/* <!-- Desktop Filters --> */}
                    <aside className="hidden lg:block w-64 bg-white border border-gray-100 rounded-2xl p-6 h-fit">
                        <h3 className="font-semibold mb-4">Category</h3>
                        <div className="space-y-3 text-sm text-gray-600">
                            <label className="flex gap-3 text-lg"><input onChange={(e) => handleFilters(e)} type="checkbox" value={"Electronics"} className="accent-indigo-600" /> Electronics</label>
                            <label className="flex gap-3 text-lg"><input onChange={(e) => handleFilters(e)} type="checkbox" value={"Fashion"} className="accent-indigo-600" /> Fashion</label>
                            <label className="flex gap-3 text-lg"><input onChange={(e) => handleFilters(e)} type="checkbox" value={"Books"} className="accent-indigo-600" /> Books</label>
                            <label className="flex gap-3 text-lg"><input onChange={(e) => handleFilters(e)} type="checkbox" value={"Home"} className="accent-indigo-600" /> Home</label>
                            <label className="flex gap-3 text-lg"><input onChange={(e) => handleFilters(e)} type="checkbox" value={"Other"} className="accent-indigo-600" /> Other</label>
                        </div>
                    </aside>

                    {/* <!-- Products --> */}
                    <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                        {isLoading ? (
                            <div className="text-center col-span-full">Loading products...</div>
                        ) : isError ? (
                            <div className="text-center text-red-500 col-span-full">
                                Failed to load products
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center col-span-full">No products found</div>
                        ) : (
                            <>
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}

                                {/* Infinite Scroll Trigger */}
                                <div ref={loadMoreRef} className="col-span-full text-center py-6">
                                    {isFetchingNextPage && "Loading more products..."}
                                    {!hasNextPage && "No more products"}
                                </div>
                            </>
                        )}
                    </section>


                </div>
            </main>

            {/* <!-- ================= MOBILE FILTER DRAWER ================= --> */}
            <div id="filterBackdrop" className={`fixed inset-0 bg-black/40 z-40 ${isOpen ? '' : 'hidden'}`} onClick={handleFilterToggle}></div>

            <aside id="mobileFilters"
                className={`fixed top-0 right-0 w-80 h-full bg-white z-50  transition-transform duration-300 p-6 ${isOpen ? '' : 'translate-x-full'}`}>

                <div className="flex justify-between mb-6">
                    <h3 className="font-bold text-lg">Filters</h3>
                    <button onClick={handleFilterToggle}><X /></button>
                </div>

                <h4 className="font-semibold mb-4">Category</h4>
                <div className="space-y-3 text-sm text-gray-600">
                    <label className="flex gap-3"><input type="checkbox" value={"Electronics"} onChange={(e) => handleFilters(e)} className="accent-indigo-600" /> Electronics</label>
                    <label className="flex gap-3"><input type="checkbox" value={"Fashion"} onChange={(e) => handleFilters(e)} className="accent-indigo-600" /> Fashion</label>
                    <label className="flex gap-3"><input type="checkbox" value={"Books"} onChange={(e) => handleFilters(e)} className="accent-indigo-600" /> Books</label>
                    <label className="flex gap-3"><input onChange={(e) => handleFilters(e)} type="checkbox" value={"Bags"} className="accent-indigo-600" /> Home</label>
                    <label className="flex gap-3"><input onChange={(e) => handleFilters(e)} type="checkbox" value={"LifeStyle"} className="accent-indigo-600" /> Other</label>
                </div>
            </aside>

        </>
    )
}

export default Shop