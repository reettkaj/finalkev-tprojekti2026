*** Settings ***
Resource    ../resources/CommonKeywords.robot

*** Test Cases ***
UC4 Hengitysharjoituksen Suorittaminen
    Open Browser To Page    hengitysharjoitus.html

    Get Title    ==    Hengitys

    Get Text    xpath=(//h1)[1]
...    ==    Hengitysharjoitus

    Click    id=startBtn

    Wait For Elements State    id=exerciseView    visible

    Wait For Elements State    id=instruction    visible

    Sleep    2s

    Get Text    id=instruction    contains    Valmistaudu

    Sleep    4s

    Get Text    id=instruction    contains    Hengitä sisään

        Wait Until Keyword Succeeds
        ...    10s
        ...    1s
        ...    Get Text    id=instruction    contains    Pidätä

    Close Browser Session