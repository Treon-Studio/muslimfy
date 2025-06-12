import { CountButton } from "~features/count-button"

import "~base.css"
import "~style.css"

function IndexPopup() {
  return (
    <div className="flex bg-gray-1 items-center justify-center h-16 w-[14rem]">
      <CountButton />
    </div>
  )
}

export default IndexPopup
