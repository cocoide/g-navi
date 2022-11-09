import { useRouter } from "next/router"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function ShopPage() {
    const router = useRouter()

    const { data, error } = useSWR<ShopObj>(
        router.query.id ? `/api/shop/${router.query.id}` : null, fetcher
    )
    //     router.query.name ? `/shop/${router.query.name}` : null,
    //     fetcher
    // )

    if (error) return <div>Failed to fetch shop data</div>
    if (!data) return (
        <div className="flex justify-center place-items-center
        animate-pulse">
            <div className="w-screen h-screen rounded-md p-5 bg-slate-300"></div>
        </div>
    )

    return (
        <>
            <h2 className="text-center text-2xl m-5">{data.name}</h2>
        </>
    );
};
