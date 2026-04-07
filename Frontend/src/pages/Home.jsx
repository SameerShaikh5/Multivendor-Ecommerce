import { Armchair, Backpack, BadgeCheck, ShieldCheck, ShoppingBag, Smartphone, Truck, Watch } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import CategoryCard from '../components/categoryCard';
import { Link } from 'react-router-dom';
import heroImg from "../assets/img/heroimg.jpg";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../api/productApi";

const Home = () => {

    const { data, isLoading, isError } = useQuery({
        queryKey: ["featured-products"],
        queryFn: fetchProducts,
        staleTime: 1000 * 60 * 5,
    });

    const featuredProducts =
        data?.data?.slice(0, 4).map((product) => ({
            id: product._id,
            name: product.name,
            price: product.price,
            description: product.description,
            imageUrl:
                product.images?.find((img) => img.isThumbnail)?.secure_url ||
                product.images?.[0]?.secure_url ||
                "https://placehold.co/400x400",
        })) || [];

        
    const categories = [
        {
            id: 1,
            name: "Electronics",
            icon: Smartphone,
            slug: "electronics",
        },
        {
            id: 2,
            name: "Accessories",
            icon: ShoppingBag,
            slug: "accessories",
        },
        {
            id: 3,
            name: "Furniture",
            icon: Armchair,
            slug: "furniture",
        },
        {
            id: 4,
            name: "Lifestyle",
            icon: Watch,
            slug: "lifestyle",
        },
        {
            id: 5,
            name: "Bags",
            icon: Backpack,
            slug: "bags",
        },
    ];



    return (
        <>

            {/* <!-- ================= HERO SECTION ================= --> */}
            <section className="max-w-7xl mx-auto px-4 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                    {/* <!-- Left Content --> */}
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-6">
                            Discover products<br></br>
                            built for modern living
                        </h1>

                        <p className="text-gray-600 text-lg max-w-lg mb-8">
                            Shop curated tech, lifestyle, and everyday essentials crafted with
                            quality, performance, and design in mind.
                        </p>

                        <Link to={"/shop"}
                            className="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-indigo-700 transition">
                            Shop Now
                        </Link>
                    </div>

                    {/* <!-- Right Visual --> */}
                    <div className="hidden md:block">
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-600/10 rounded-3xl blur-3xl"></div>

                            <img
                                src={heroImg}
                                fetchPriority="high"
                                loading="lazy"
                                decoding="async"
                                className="relative rounded-3xl shadow-xl"
                                alt="Modern shopping setup"
                            />

                        </div>
                    </div>

                </div>
            </section>

            {/* <!-- ================= CATEGORY SECTION ================= --> */}
            <section className="max-w-7xl mx-auto px-4 py-16">

                {/* <!-- Section Title --> */}
                <div className="mb-10">
                    <h2 className="text-3xl font-extrabold tracking-tight mb-2">
                        Shop by Category
                    </h2>
                    <p className="text-gray-600">
                        Browse products across our most popular categories
                    </p>
                </div>

                {/* <!-- Categories --> */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">

                    {/* <!-- Category Card --> */}

                    {categories.map((elem) => (
                        <CategoryCard icon={elem.icon} name={elem.name} key={elem.slug} />

                    ))}

                </div>
            </section>

            {/* <!-- ================= FEATURED PRODUCTS ================= --> */}
            <section className="max-w-7xl mx-auto px-4 py-20">

                {/* <!-- Section Header --> */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight mb-2">
                            Featured Products
                        </h2>
                        <p className="text-gray-600">
                            Handpicked items our customers love
                        </p>
                    </div>

                    <Link to="/shop" className="text-sm font-semibold text-indigo-600 hover:underline">
                        View all →
                    </Link>
                </div>

                {/* <!-- Products Grid --> */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">


                    {/* <!-- Product Card --> */}

                    {isLoading ? (
                        <div className="text-center text-gray-500">Loading products...</div>
                    ) : isError ? (
                        <div className="text-center text-red-500">Failed to load products</div>
                    ) : featuredProducts.length === 0 ? (
                        <div className="text-center text-gray-500">No products available</div>
                    ) : (
                        featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    )}


                </div>
            </section>


            {/* <!-- ================= TRUST / HIGHLIGHTS SECTION ================= --> */}
            <section className="bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-16">

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

                        {/* <!-- Item --> */}
                        <div className="flex items-start gap-4">
                            <div className="bg-indigo-600/10 p-3 rounded-xl">
                                <Truck />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-1">
                                    Fast Delivery
                                </h4>
                                <p className="text-sm text-gray-600">
                                    Quick and reliable shipping across India
                                </p>
                            </div>
                        </div>

                        {/* <!-- Item --> */}
                        <div className="flex items-start gap-4">
                            <div className="bg-indigo-600/10 p-3 rounded-xl">
                                <ShieldCheck />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-1">
                                    Secure Payments
                                </h4>
                                <p className="text-sm text-gray-600">
                                    100% safe and encrypted transactions
                                </p>
                            </div>
                        </div>

                        {/* <!-- Item --> */}
                        <div className="flex items-start gap-4">
                            <div className="bg-indigo-600/10 p-3 rounded-xl">
                                <BadgeCheck />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-1">
                                    Quality Guaranteed
                                </h4>
                                <p className="text-sm text-gray-600">
                                    Products verified for quality & durability
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    )
}

export default Home