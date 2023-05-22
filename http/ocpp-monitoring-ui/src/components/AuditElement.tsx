export function AuditElement({text, time}: {text: string, time: string}) {
  return (
    <li role="article" className="relative pl-6 ">
          <span className="absolute left-0 z-10 flex items-center justify-center w-8 h-8 text-white -translate-x-1/2 rounded-full bg-emerald-500 ring-2 ring-white ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4"
              role="presentation"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
              />
            </svg>
          </span>
          <div className="flex flex-col flex-1 gap-0">
            <h4 className="text-sm font-medium text-slate-700">
              {" "}
              {text}
            </h4>
            <p className="text-xs text-slate-500">{time}</p>
          </div>
        </li>
  )
}