/* istanbul ignore next */
const categories = {
  'analytics': 'Analytics',
  'chat': 'Chat',
  'experimentation': 'Experimentation',
  'personalization': 'Personalization',
  'pixel': 'Marketing / Advertising Pixel',
  'utility': 'Utility'
};

const permissions = {
  access_globals: 'Accesses Global Variables',
  get_cookies: 'Reads cookie value(s)',
  get_referrer: 'Reads Referrer URL',
  get_url: 'Reads URL',
  inject_hidden_iframe: 'Injects Hidden Iframes',
  inject_script: 'Injects Scripts',
  logging: 'Logs to Console',
  read_data_layer: 'Reads Data Layer',
  read_character_set: 'Reads Document Character Set',
  read_title: 'Reads Document Title',
  send_pixel: 'Sends Pixels',
  set_cookies: 'Sets a cookie value'
};

const permissions_icons = {
  access_globals: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzc1NzU3NSI+CiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+CiAgICA8cGF0aCBkPSJNMTkgNEg1Yy0xLjExIDAtMiAuOS0yIDJ2MTJjMCAxLjEuODkgMiAyIDJoNHYtMkg1VjhoMTR2MTBoLTR2Mmg0YzEuMSAwIDItLjkgMi0yVjZjMC0xLjEtLjg5LTItMi0yem0tNyA2bC00IDRoM3Y2aDJ2LTZoM2wtNC00eiIvPgo8L3N2Zz4K',
  get_cookies: 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA0OCA0OCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgNDggNDgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6Y2M9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zIyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48bWV0YWRhdGE+PHJkZjpSREY+PGNjOldvcmsgcmRmOmFib3V0PSIiPjxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PjxkYzp0eXBlIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiLz48ZGM6dGl0bGUvPjwvY2M6V29yaz48L3JkZjpSREY+PC9tZXRhZGF0YT48c3R5bGUgdHlwZT0idGV4dC9jc3MiPgogIC5zdDB7ZmlsbDpub25lO30KICAuc3Qxe2ZpbGw6I0ZGRkZGRjt9CiAgLnN0MntmaWxsOiM4MDgwODA7fQo8L3N0eWxlPjxyZWN0IGNsYXNzPSJzdDAiIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIvPjxjaXJjbGUgY2xhc3M9InN0MiIgY3g9IjI0IiBjeT0iMjQiIHI9IjIwIi8+PGNpcmNsZSBjbGFzcz0ic3QxIiBjeD0iMzQiIGN5PSIzMCIgcj0iMy4zIi8+PGNpcmNsZSBjbGFzcz0ic3QxIiBjeD0iMjIuOCIgY3k9IjI1LjMiIHI9IjMuMyIvPjxjaXJjbGUgY2xhc3M9InN0MSIgY3g9IjIyIiBjeT0iMzcuMyIgcj0iMy4zIi8+PGNpcmNsZSBjbGFzcz0ic3QxIiBjeD0iMTguOCIgY3k9IjE0LjciIHI9IjMuMyIvPjxjaXJjbGUgY2xhc3M9InN0MSIgY3g9IjExLjciIGN5PSIyMyIgcj0iMy4zIi8+PGltYWdlIGlkPSJMYXllcl8wXzFfIiB0cmFuc2Zvcm09Im1hdHJpeCguMjk5MiAwIDAgLjI5OTIgLTEzLjkxIC03LjY0NTQpIiB3aWR0aD0iMzIwIiBoZWlnaHQ9IjIzNCIgZGlzcGxheT0ibm9uZSIgb3BhY2l0eT0iLjQzIiBvdmVyZmxvdz0idmlzaWJsZSIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Im00NyAyMS43Yy0wLjEgMS4xLTAuNCAyLjEtMS4xIDMtMC41LTEuMy0xLjEtMi41LTEuNi0zLjgtMC4zLTAuNy0wLjctMS41LTEuNC0xLjgtMC41LTAuMi0xLjEtMC4xLTEuNiAwLTEgMC4yLTIgMC4zLTIuOSAwLjUtMC44IDAuMS0xLjMtMC45LTEuNC0xLjdzMC0xLjctMC42LTIuM2MtMC43LTAuNy0xLjgtMC42LTIuOC0wLjUtMC44IDAuMS0xLjUgMC0yLjMgMC0wLjEgMC0wLjMgMC0wLjQtMC4xcy0wLjItMC40LTAuMi0wLjV2LTEuN2MwLTAuMyAwLTAuNi0wLjItMC44LTAuMi0wLjMtMC43LTAuMy0xLTAuM2gtMy4yYy0wLjItMS4xIDAuMS0yLjMgMC40LTMuNCAwLjItMS4xIDAuNC0yLjQtMC4zLTMuMy0wLjQtMS4xLTEuNC0xLjQtMi4zLTEuNS0wLjkgMC0xLjkgMC4yLTIuOCAwLjUgMC43LTEuNSAxLjgtMi45IDMuMi00aDE5LjVjMC40IDAuNSAwLjggMS4xIDEuMSAxLjggMS42IDMgMi4xIDYuNSAyLjIgOS45IDAuMyAzLjMgMC4xIDYuNy0wLjMgMTB6Ii8+PC9zdmc+Cg==',
  get_referrer: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9IiM3NTc1NzUiIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCI+CjxnPgogIDxwYXRoIGQ9Ik0xNC41LDE2LjV2LTFjMC0wLjgtMC43LTEuNS0xLjUtMS41SDkuNXY2SDExdi0yaDEuMmwwLjgsMmgxLjVsLTAuOS0yLjFDMTQuMSwxNy43LDE0LjUsMTcuMSwxNC41LDE2LjV6IE0xMywxNi41aC0ydi0xaDIKICAgIFYxNi41eiIvPgogIDxwYXRoIGQ9Ik00LjUsMTRIM3Y1YzAsMC41LDAuNSwxLDEsMWgzYzAuNSwwLDEtMC41LDEtMXYtNUg2LjV2NC41aC0yVjE0eiIvPgogIDxwYXRoIGQ9Ik0yMSwxOC41aC0zLjVWMTRIMTZ2NWMwLDAuNSwwLjUsMSwxLDFoNFYxOC41eiIvPgo8L2c+CjxwYXRoIGQ9Ik0xMS43LDQuNkM5LjgsNC42LDgsNS40LDYuNiw2LjVMNCwzLjl2Ni42aDYuNkw3LjksNy44YzEtMC45LDIuMy0xLjQsMy44LTEuNGMyLjYsMCw0LjgsMS43LDUuNiw0TDE5LDkuOQogICAgICAgIEMxOCw2LjksMTUuMSw0LjYsMTEuNyw0LjZ6Ii8+Cjwvc3ZnPgo=',
  get_url: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9IiM3NTc1NzUiIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCI+CjxnPgogIDxwYXRoIGQ9Ik0xNC41LDExLjV2LTFDMTQuNSw5LjcsMTMuOCw5LDEzLDlIOS41djZIMTF2LTJoMS4ybDAuOCwyaDEuNWwtMC45LTIuMUMxNC4xLDEyLjcsMTQuNSwxMi4xLDE0LjUsMTEuNXogTTEzLDExLjVoLTJ2LTFoMgogICAgVjExLjV6Ii8+CiAgPHBhdGggZD0iTTQuNSw5SDN2NWMwLDAuNSwwLjUsMSwxLDFoM2MwLjUsMCwxLTAuNSwxLTFWOUg2LjV2NC41aC0yVjl6Ii8+CiAgPHBhdGggZD0iTTIxLDEzLjVoLTMuNVY5SDE2djVjMCwwLjUsMC41LDEsMSwxaDRWMTMuNXoiLz4KPC9nPgo8L3N2Zz4K',
  inject_hidden_iframe: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzc1NzU3NSI+CiAgICA8cGF0aCBkPSJNMTkgN2gtOHY2aDhWN3ptMi00SDNjLTEuMSAwLTIgLjktMiAydjE0YzAgMS4xLjkgMS45OCAyIDEuOThoMThjMS4xIDAgMi0uODggMi0xLjk4VjVjMC0xLjEtLjktMi0yLTJ6bTAgMTYuMDFIM1Y0Ljk4aDE4djE0LjAzeiIvPgogICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4K',
  inject_script: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzc1NzU3NSI+CiAgICA8cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDI0djI0SDBWMHoiLz4KICAgIDxwYXRoIGQ9Ik05LjQgMTYuNkw0LjggMTJsNC42LTQuNkw4IDZsLTYgNiA2IDYgMS40LTEuNHptNS4yIDBsNC42LTQuNi00LjYtNC42TDE2IDZsNiA2LTYgNi0xLjQtMS40eiIvPgo8L3N2Zz4K',
  logging: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzc1NzU3NSI+CiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+CiAgICA8cGF0aCBkPSJNMjAgOGgtMi44MWMtLjQ1LS43OC0xLjA3LTEuNDUtMS44Mi0xLjk2TDE3IDQuNDEgMTUuNTkgM2wtMi4xNyAyLjE3QzEyLjk2IDUuMDYgMTIuNDkgNSAxMiA1Yy0uNDkgMC0uOTYuMDYtMS40MS4xN0w4LjQxIDMgNyA0LjQxbDEuNjIgMS42M0M3Ljg4IDYuNTUgNy4yNiA3LjIyIDYuODEgOEg0djJoMi4wOWMtLjA1LjMzLS4wOS42Ni0uMDkgMXYxSDR2MmgydjFjMCAuMzQuMDQuNjcuMDkgMUg0djJoMi44MWMxLjA0IDEuNzkgMi45NyAzIDUuMTkgM3M0LjE1LTEuMjEgNS4xOS0zSDIwdi0yaC0yLjA5Yy4wNS0uMzMuMDktLjY2LjA5LTF2LTFoMnYtMmgtMnYtMWMwLS4zNC0uMDQtLjY3LS4wOS0xSDIwVjh6bS02IDhoLTR2LTJoNHYyem0wLTRoLTR2LTJoNHYyeiIvPgo8L3N2Zz4K',
  read_data_layer: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzc1NzU3NSI+CiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+CiAgICA8cGF0aCBkPSJNMTEuOTkgMTguNTRsLTcuMzctNS43M0wzIDE0LjA3bDkgNyA5LTctMS42My0xLjI3LTcuMzggNS43NHpNMTIgMTZsNy4zNi01LjczTDIxIDlsLTktNy05IDcgMS42MyAxLjI3TDEyIDE2eiIvPgo8L3N2Zz4K',
  read_character_set: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzc1NzU3NSI+CiAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPgogIDxwYXRoIGQ9Ik0xMi44NyAxNS4wN2wtMi41NC0yLjUxLjAzLS4wM2MxLjc0LTEuOTQgMi45OC00LjE3IDMuNzEtNi41M0gxN1Y0aC03VjJIOHYySDF2MS45OWgxMS4xN0MxMS41IDcuOTIgMTAuNDQgOS43NSA5IDExLjM1IDguMDcgMTAuMzIgNy4zIDkuMTkgNi42OSA4aC0yYy43MyAxLjYzIDEuNzMgMy4xNyAyLjk4IDQuNTZsLTUuMDkgNS4wMkw0IDE5bDUtNSAzLjExIDMuMTEuNzYtMi4wNHpNMTguNSAxMGgtMkwxMiAyMmgybDEuMTItM2g0Ljc1TDIxIDIyaDJsLTQuNS0xMnptLTIuNjIgN2wxLjYyLTQuMzNMMTkuMTIgMTdoLTMuMjR6Ii8+Cjwvc3ZnPgo=',
  read_title: 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIyLjEuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgogIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMjQgMjQiIHhtbDpzcGFjZT0icHJlc2VydmUiIGZpbGw9IiM3NTc1NzUiPgo8cmVjdCBmaWxsPSJub25lIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiLz4KPGcgaWQ9IlhNTElEXzFfIj4KICA8cGF0aCBpZD0iWE1MSURfMzk1OF8iIGQ9Ik0yLDJ2MjBoMjBWMkgyeiBNNCwyMFY0aDE2djE2SDR6Ii8+CiAgPHJlY3QgaWQ9IlhNTElEXzI1OF8iIHg9IjUiIHk9IjYiIHdpZHRoPSIxMSIgaGVpZ2h0PSI0Ii8+CiAgPHJlY3QgaWQ9IlhNTElEXzI4NTJfIiBmaWxsPSJub25lIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiLz4KPC9nPgo8L3N2Zz4K',
  send_pixel: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzc1NzU3NSI+CiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+CiAgICA8cGF0aCBkPSJNMjEgMTlWNWMwLTEuMS0uOS0yLTItMkg1Yy0xLjEgMC0yIC45LTIgMnYxNGMwIDEuMS45IDIgMiAyaDE0YzEuMSAwIDItLjkgMi0yek04LjUgMTMuNWwyLjUgMy4wMUwxNC41IDEybDQuNSA2SDVsMy41LTQuNXoiLz4KPC9zdmc+Cgo=',
  set_cookies: 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA0OCA0OCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgNDggNDgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6Y2M9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zIyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48bWV0YWRhdGE+PHJkZjpSREY+PGNjOldvcmsgcmRmOmFib3V0PSIiPjxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PjxkYzp0eXBlIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiLz48ZGM6dGl0bGUvPjwvY2M6V29yaz48L3JkZjpSREY+PC9tZXRhZGF0YT48c3R5bGUgdHlwZT0idGV4dC9jc3MiPgogIC5zdDB7ZmlsbDpub25lO30KICAuc3Qxe2ZpbGw6I0ZGRkZGRjt9CiAgLnN0MntmaWxsOiM4MDgwODA7fQo8L3N0eWxlPjxyZWN0IGNsYXNzPSJzdDAiIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIvPjxjaXJjbGUgY2xhc3M9InN0MiIgY3g9IjI0IiBjeT0iMjQiIHI9IjIwIi8+PGNpcmNsZSBjbGFzcz0ic3QxIiBjeD0iMzQiIGN5PSIzMCIgcj0iMy4zIi8+PGNpcmNsZSBjbGFzcz0ic3QxIiBjeD0iMjIuOCIgY3k9IjI1LjMiIHI9IjMuMyIvPjxjaXJjbGUgY2xhc3M9InN0MSIgY3g9IjIyIiBjeT0iMzcuMyIgcj0iMy4zIi8+PGNpcmNsZSBjbGFzcz0ic3QxIiBjeD0iMTguOCIgY3k9IjE0LjciIHI9IjMuMyIvPjxjaXJjbGUgY2xhc3M9InN0MSIgY3g9IjExLjciIGN5PSIyMyIgcj0iMy4zIi8+PGltYWdlIGlkPSJMYXllcl8wXzFfIiB0cmFuc2Zvcm09Im1hdHJpeCguMjk5MiAwIDAgLjI5OTIgLTEzLjkxIC03LjY0NTQpIiB3aWR0aD0iMzIwIiBoZWlnaHQ9IjIzNCIgZGlzcGxheT0ibm9uZSIgb3BhY2l0eT0iLjQzIiBvdmVyZmxvdz0idmlzaWJsZSIvPjxjaXJjbGUgY2xhc3M9InN0MSIgY3g9IjMxLjg0NSIgY3k9IjE3LjY1NCIgcj0iMy4zIiBmaWxsPSIjZmZmIi8+PC9zdmc+Cg=='
};

const dsKind = {
  PRODUCTION: 'Template',
  DEVELOPMENT: 'Template_dev'
};

const allowedFilterValues= {
  sort: {
    'views': 'Most views',
    'downloads': 'Most downloads',
    'added_date': 'Newest',
    'updated_date': 'Last Modified'
  },
  templateTypes: {
    'tag': 'Tag',
    'variable': 'Variable'
  },
  categories: categories
};

module.exports = {
  categories,
  permissions,
  permissions_icons,
  dsKind,
  allowedFilterValues
};
