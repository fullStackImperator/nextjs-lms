import { Logo } from "./logo"
import { SiedebarRoutes } from "./sidebar-routes"

export const Sidebar = () => {
    return (
      <div className="h-full border-r mt-[80px] flex flex-col overflow-y-auto bg-white shadow-sm">
        {/* <div className="p-6">
          <Logo />
        </div> */}
        <div className="flex flex-col w-full">
          <SiedebarRoutes />
        </div>
      </div>
    )
}

