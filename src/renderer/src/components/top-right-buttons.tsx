import { Button } from "./ui/button";

export function SignOut(){
  return (
    <Button variant="outline" size="icon" className="align-top" onClick={async () => {
        await window.api.setSetting({setting: 'token', value: null})
        await window.api.setSetting({setting: 'refresh_token', value: null})
        window.location.reload()
    }}>
      <span className="ml-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H4a3 3 0 01-3-3V7a3 3 0 013-3h6a3 3 0 013 3v1" />
        </svg>
      </span>
      <span className="sr-only">Sign Out</span>
    </Button>
  )
}

export function ReloadPage(){
  return (
    <Button variant="outline" size="icon" className="align-top" onClick={() => window.location.reload()}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1" clipRule="evenodd" viewBox="0 0 24 24" className="w-5 h-5">
        <path fillRule="nonzero" d="m21.897 13.404.008-.057v.002c.024-.178.044-.357.058-.537.024-.302-.189-.811-.749-.811a.75.75 0 0 0-.747.69c-.018.221-.044.44-.078.656-.645 4.051-4.158 7.153-8.391 7.153a8.495 8.495 0 0 1-7.206-3.995l1.991-.005a.75.75 0 0 0 0-1.5H2.75a.75.75 0 0 0-.75.75v4.049a.75.75 0 0 0 1.5 0l.003-2.525A9.996 9.996 0 0 0 11.998 22c5.042 0 9.217-3.741 9.899-8.596zM2.123 10.43l-.009.056v-.002c-.035.233-.063.469-.082.708-.024.302.189.811.749.811a.75.75 0 0 0 .747-.69c.022-.28.058-.556.107-.827.716-3.968 4.189-6.982 8.362-6.982a8.495 8.495 0 0 1 7.206 3.995l-1.991.005a.75.75 0 0 0 0 1.5h4.033a.75.75 0 0 0 .75-.75V4.205a.75.75 0 0 0-1.5 0l-.003 2.525a9.996 9.996 0 0 0-8.495-4.726c-4.984 0-9.12 3.654-9.874 8.426z"/>
      </svg>
      <span className="sr-only">Reload Page</span>
    </Button>
  )
}
