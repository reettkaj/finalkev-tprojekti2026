*** Settings ***
Library    Browser

*** Variables ***
${BASE_URL}    http://localhost:5173

*** Keywords ***

Open Browser To Page
    [Arguments]    ${page}

    New Browser    chromium    headless=No
    New Context
    New Page    ${BASE_URL}/${page}

Close Browser Session
    Close Browser