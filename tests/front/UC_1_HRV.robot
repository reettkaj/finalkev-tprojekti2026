*** Settings ***
Resource    ../resources/CommonKeywords.robot

*** Test Cases ***
UC1 HRV Mittaus Ja Oirekysely
    Open Browser To Page    hrv.html

    Get Title    ==    HRV

    Get Text    xpath=//h2[text()='Hyvinvointidata']
...    ==    Hyvinvointidata

    Wait For Elements State    css=.hrv-summary-grid    visible

    Wait For Elements State    id=jsChart    visible

    Get Text    css=.recovery-message    contains    Dataa

    Close Browser Session


UC1 TSQ Oirekyselyn Avaaminen
    Open Browser To Page    asetukset.html

    Get Title    ==    Asetukset

    Click    id=open-tsq-btn

    Wait For Elements State    id=tsq-overlay    visible

    Get Text    css=.tsq-modal h2    contains    Traumaseulontakysely

    Get Text    css=.tsq-intro
    ...    contains
    ...    Vastaa kaikkiin kysymyksiin

    Close Browser Session