  export interface CategoryInputData {
    name: string
    options: string[]
  }

  export interface Result {
    category: string
    choice: string
  }

  export  interface CategorySetting {
    selected: string | null
    custom: string
  }