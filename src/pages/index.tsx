import { GetStaticProps } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { FC } from "react"
import { SearchForm } from "../components/SearchForm"
import { useUserFormState } from "../infrastructure/recoil/UserFormState"
import { useShopDataSWR } from "../infrastructure/UseShopDataSRW"
import { fetcher } from "../libs/fetcher"

interface Props {
  fallbackData: HotpepperResponseType
}

const Home: FC<Props> = ({ fallbackData }) => {
  // Recoil を hook化
  // ユーザーが入力したキーワード
  const userSetKeyword: string = useUserFormState()
  // useSWR を hook化
  // getStaticProps からの fallbackDataを初期値に持つ。
  // クライアント側でのデータフェッチを行う。
  const { data } = useShopDataSWR(userSetKeyword, fallbackData)
  const router = useRouter();


  return (
    <div>

      <div className="flex flex-row justify-center place-items-center">
        <h1 className="text-3xl m-4 text-center">東京グルメ検索
        </h1>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      </div>

      <SearchForm userSetKeyword={`${userSetKeyword}`} fallbackData={fallbackData} />
      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 m-3 md:gap-5 md:m-5">
          {data?.results ? (
            data.results.shop.map((shopData: ShopObj) => {

              return (
                <div key={shopData.id} className="rounded-md 
                bg-gradient-to-tr from-indigo-300 to-indigo-100
                p-3 md drop-shadow-xl">
                  <p>
                    <span className=""
                    >掲載店名:</span>
                    <br />
                    {shopData.name}
                  </p>
                  <p>
                    <span className=""
                    >最寄駅名:</span>
                    <br />
                    {shopData.station_name}
                  </p>
                  <p>
                    <span className=""
                    >お店ジャンル:</span>
                    <br />
                    {shopData.genre.name}
                  </p>
                  <p>
                    <span className=""
                    >お店ジャンルキャッチ:</span>
                    <br />
                    {shopData.genre.catch}
                  </p>
                  <button
                    onClick={() => router.push(`/shop/${shopData.id}`)}
                    className="bg-slate-200 drop-shadow p-1 rounded-md"
                  >詳しく</button>
                </div>
              )
            })
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </main>
    </div>
  )
}

export default Home

export const getStaticProps: GetStaticProps = async () => {
  if (typeof process.env.API_URL_ROOT === 'undefined') {
    return {
      props: {
        fallbackData: undefined
      }
    }
  }

  const API_URL = process.env.API_URL_ROOT

  const data = await fetcher(API_URL)
  return {
    props: {
      fallbackData: data
    }
  }
}