import { GetStaticProps } from "next"
import { FC } from "react"
import { SearchForm } from "../components/SearchForm"
import { useUserFormState } from "../infrastructure/UserFormState"
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
  return (
    <div>
      <h1 className="text-left">東京グルメ検索(ホットペッパーAPI)</h1>
      <SearchForm userSetKeyword={`${userSetKeyword}`} fallbackData={fallbackData} />
      {data?.results ? (
        data.results.shop.map((shopData: ShopObj) => {

          return (
            <div key={shopData.id} className="">
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
            </div>
          )
        })
      ) : (
        <p>Loading...</p>
      )}
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