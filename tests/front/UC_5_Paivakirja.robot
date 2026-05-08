*** Settings ***
Resource    ../resources/CommonKeywords.robot

*** Test Cases ***
UC5 Oirepaivakirjan Kirjaaminen
    Open Browser To Page    paivakirja.html

    Get Text    xpath=//h2[text()='Lisää päiväkirjamerkintä']
        ...    ==    Lisää päiväkirjamerkintä

    Type Text    id=entry_date      2026-05-08

    Type Text    id=weight          72

    Type Text    id=sleep_hours     7

    Type Text    id=energy_level    5

    Type Text    id=stress_level    8

    Type Text    id=mood            Ahdistunut

    Type Text    id=symptom         Univaikeudet

    Type Text    id=medication      Ei

    Type Text    id=notes
    ...    Tänään ollut stressaava päivä.

    Click    css=button[type="submit"]

    Sleep    2s

    Close Browser Session