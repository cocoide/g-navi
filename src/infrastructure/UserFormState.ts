import { useCallback } from 'react'
import { atom, SetterOrUpdater, useRecoilValue, useSetRecoilState } from 'recoil'

// 参照元の記事
//  https://zenn.dev/yoshiko/articles/607ec0c9b0408d#recoil%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%9Fglobal-state%E3%81%AE%E7%AE%A1%E7%90%86

/**
 * @description ユーザーが入力したキーワードを定義するAtom
 */
export const userFormState = atom<string>({
  key: 'UserInputKeyword',
  default: ''
})

/**
 * @description ユーザーが入力したキーワード
 */
export const useUserFormState = (): string => {
  return useRecoilValue(userFormState)
}

interface useUserFormMutatorType {
  setSearchWord: (x: string) => void
}

/**
 * @description ユーザーが入力したキーワードをセットする関数
 */
export const useUserFormMutator = (): useUserFormMutatorType => {
  const setState: SetterOrUpdater<string> = useSetRecoilState(userFormState)
  const setSearchWord = useCallback(
    (x: string) => {
      setState(x)
    },
    [setState]
  )

  return { setSearchWord }
}
