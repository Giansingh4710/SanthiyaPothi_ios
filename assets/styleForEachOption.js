//#75f1e0
//#84f8c8
//#a3fbaa
//#cbfc8b
//#f9f871
//-----------------
//#041C32
//#04293A
//#064663
//#ECB365

//all colors in all files should be here
//if darkmode true -> allColors[true] and vice versa
export const allColors = {
  false: {
    headerColor: '#CAF1DE',
    mainBackgroundColor: '#FEF8DD',
    //format for the colors: filename > obj-name > propertyName
    settingBarSwitch: {
      settingBar: {
        backgroundColor: '#f9f871',
      },
    },
    readShabad:{
      container:"#b8f5d7",
    },
    shabadPage:{
      openShabadBtn:"#b8f5d7",
    },
    openPdf: {},
    mainScreenList: {},
    modal:{}
  },
  true: {
    headerColor: '#041C32',
    mainBackgroundColor: '#064663',
    //format for the colors: filename > obj-name > propertyName
    settingBarSwitch: {
      settingBar: {
        backgroundColor: '#d09374',
      },
    },
    readShabad:{
      container:"#04293A",
    },
    shabadPage:{
      openShabadBtn:"#04293A",
    },
    openPdf: {},
    mainScreenList: {},
  },
};
