<template>
  <button class="z-10 w-32 h-fit fixed" @click="fetchSegments">Search in area</button>
  <Map ref="mapRef"/>
</template>

<script setup>
import {ref} from 'vue';
import Map from './map.vue';

const mapRef = ref(null);

async function fetchSegments() {
  if (mapRef.value) {
    const bounds = mapRef.value.getCurrentBounds().join(",");
    if (bounds) {
      const segments = [
        {
          "id": 16640911,
          "resource_state": 2,
          "name": "Kitzbüheler Horn km 3",
          "climb_category": 1,
          "climb_category_desc": "4",
          "avg_grade": 11.4,
          "start_latlng": [
            47.471273,
            12.399506
          ],
          "end_latlng": [
            47.472588,
            12.405177
          ],
          "elev_difference": 115.6,
          "distance": 1012.2,
          "points": "mvv`H{wtjAAu@Be@Xw@`AiBHm@b@gADe@Ca@IOGQKIKUGSIIAQOSCUKIGOM?GGQB]EKBSEGQGAGQ]GKFKCKDM?GFIAKJI?EDMAMDECKFKA]FECKDCEKBKCKBECE@GBECILKCMDEEQDOCGBMCKFOAO@ACOFMEMDMGQDMAEDICI@IMD[XCBGDCJBDAFILABCNIN[FAFQLGDQJCFUHCDMLEFOHAFQHEBSFIBGBOFIBYDE@SHMBSFCHSHEBMLIBONIFQFCDMHE",
          "starred": false,
          "elevation_profile": "https://d3o5xota0a1fcr.cloudfront.net/v6/charts/J66Z6VTWPSHUCVBRPHBK25MU5S4EYLXSUUUIO4S746QZHISK4DU4ZEF24VHTZHLMTOCZAMRR6UIRZ4HKR6UU367H",
          "local_legend_enabled": true
        },
        {
          "id": 16640903,
          "resource_state": 2,
          "name": "Kitzbüheler Horn km 1",
          "climb_category": 1,
          "climb_category_desc": "4",
          "avg_grade": 8.7,
          "start_latlng": [
            47.467345,
            12.391804
          ],
          "end_latlng": [
            47.471428,
            12.395168
          ],
          "elev_difference": 87.8,
          "distance": 1008.3,
          "points": "{}u`HwgsjAO_@Y]c@KW@uARa@Cq@S{@S{@GeCq@w@M_CGm@Mk@?SIM?_@MWG_AIIEKAOEMGI?IGQAKIWCIG[Gk@_@[e@Ec@Bk@HQBSFKDYFK@QHS?YNq@?UL]FCH?LENBLET?JD^EN@HELBFCLBJATHL@BBP?LLN?FH",
          "starred": false,
          "elevation_profile": "https://d3o5xota0a1fcr.cloudfront.net/v6/charts/TVLAOMDN4OV2HET4BN23AVCSYCMXIOITYOZN7WLCHP32P7HS22773JVP54A5LJ5IHGRZPR4K5772EH3XPPITGREN",
          "local_legend_enabled": true
        },
        {
          "id": 18187269,
          "resource_state": 2,
          "name": "Stadtsprint",
          "climb_category": 0,
          "climb_category_desc": "NC",
          "avg_grade": -1.7,
          "start_latlng": [
            47.449256,
            12.382614
          ],
          "end_latlng": [
            47.445885,
            12.388767
          ],
          "elev_difference": 10.4,
          "distance": 606,
          "points": "ylr`HinqjADa@h@gBv@aDPe@h@gAV_@X[rAmAZ[T_@Te@r@yBRc@`CeEh@gAn@uBJe@",
          "starred": false,
          "elevation_profile": "https://d3o5xota0a1fcr.cloudfront.net/v6/charts/KZ2XRNYWIH5O6Z5ZR5WLU5FPBU4JIYJD327NAEWMRAS66JD5MWFSGP7RITRUXFD2JSEOR4FHXFPVL6HJQON5KG4V",
          "local_legend_enabled": true
        },
        {
          "id": 19160516,
          "resource_state": 2,
          "name": "Römerweg Haslach - Riesberg",
          "climb_category": 0,
          "climb_category_desc": "NC",
          "avg_grade": 3.2,
          "start_latlng": [
            47.48199,
            12.385831
          ],
          "end_latlng": [
            47.467381,
            12.391326
          ],
          "elev_difference": 59.2,
          "distance": 1728.1,
          "points": "myx`HmbrjApAa@|@g@pBgBf@k@p@_AXY`DiBtAm@r@UTE~@Kx@OdAa@\\C`@Ij@Wh@Y`A{@^S\\K|@KhABl@GtAg@fDcA`@C`AH^A\\El@Ux@Mh@AbA@|@M`A@TBTHd@^RJh@T~@VlA?f@CRERKdAy@rDcCtCuAp@S",
          "starred": false,
          "elevation_profile": "https://d3o5xota0a1fcr.cloudfront.net/v6/charts/WUL7MHFFBO4G7JEHC6YPH33QXSCCU5XMCDFEP254V7ZJZLJJV33LPAAJKR3NXB4OWZO33GOCG2J5OQN5OXQKX7I=",
          "local_legend_enabled": true
        },
        {
          "id": 20847937,
          "resource_state": 2,
          "name": "Hahnenkamm Trail Top to Bottom",
          "climb_category": 0,
          "climb_category_desc": "NC",
          "avg_grade": -14.9,
          "start_latlng": [
            47.425156,
            12.370869
          ],
          "end_latlng": [
            47.440202,
            12.385628
          ],
          "elev_difference": 823.5,
          "distance": 5531.8,
          "points": "evm`H{dojA^JZ`@VHJFd@HRIHILEh@CGQFEHAXFh@Ef@RXD^Gf@?JE?KGGD@RWLKJDX\\T@DAEMAWH?t@l@l@`@H?Oy@U_@[W_@SMQkAmAIMCKFGNE|@j@D?BICA]e@MG[]g@s@WYKCYFO?s@g@g@IYMYkAKQFGJTFBDGAMM[]iAIKaBw@WWAQDKL?LFP?f@VHENAb@D`@?NBdAfAL@HGDKAOS[Oc@GOBGDCP\\HJDGBIIi@?QBIHFN\\TTHTDE@c@Ys@DCJVTTJ@DK?MIIEM_@w@CK@GHA`@NJFXZJDHDHI@Ui@cAo@oBGe@Qm@aA}AcAwAIQE[DAnCdALBTC@KCKy@iAc@c@_@g@M_@IIKAYFMCYQKCW?IIO]_@_@CGR[?WCWSYJGCKKQGUAKFERC@WDIF?BEA][aAE]?Sm@yBKW_@g@e@c@}BcBwD}BKACCm@u@BEJFD?CIIAIOAWMc@Kk@_A_DQw@AWc@oCO]cAaAQKEGDGBI_@g@IAQD_@DEGCSFK@GEDYJGFg@bBIn@Ex@a@dBO`@]h@UZYl@KJMD[AKF]b@IIHQ?GI?QBGGFc@IEI@GEEQBy@HW?KKEQDGBIAEGCIB_@FQEO?GHOSC?KEEG?FORCL@HKAKIQAMHIAKECK?[I[@IHQLMVu@rBKBGED]EEALIBINS@@[H_@@_@Pk@@SHUR]Ts@SHc@\\I?UPKBQJs@Jk@b@IJEd@GP[l@[x@_@t@CI?[EMG@KXUROh@IMEBET?PYj@SBIDKHQJ_@|ASbAMVCLO^G^?IBGGWEGEFG`@GCGK?KD_@EUCEGDCJOJCFANDRCVBJCDCEKDKN?H[b@m@To@FMPOJODk@SQYCKIQMq@e@QIIASC@GGGQW_@SSOUEBICBYGCEDG@IIAKEEAHKCa@FEAMSMFCQRWJEBG?IECK?YPMTECEKHg@FUT[@MMKcAr@QGEKDM?WPuAAGE@GQECMBK?MAOIOAgA?a@Oe@Eg@Qe@EWU]?]LMAQE",
          "starred": false,
          "elevation_profile": "https://d3o5xota0a1fcr.cloudfront.net/v6/charts/MM4GQCEIOOCYDPSZBF7UXJH52X5LMPQW3R76JWAOWEIWKBNYZPHQJRHCQ33H6JELWUS4MHMML27N66UMD37SE6WR",
          "local_legend_enabled": true
        },
        {
          "id": 25275368,
          "resource_state": 2,
          "name": "RED Line",
          "climb_category": 0,
          "climb_category_desc": "NC",
          "avg_grade": -12.6,
          "start_latlng": [
            47.496678,
            12.403301
          ],
          "end_latlng": [
            47.499614,
            12.401282
          ],
          "elev_difference": 56.8,
          "distance": 449.7,
          "points": "eu{`HsoujAg@DYRSAYFcAE]MEB@RCDG?WGe@SkBAADLRAFUHAFHJ?DC@IAG@ABJL?FGDG@UCOTITG`@MTOh@OZk@tAM`@",
          "starred": false,
          "elevation_profile": "https://d3o5xota0a1fcr.cloudfront.net/v6/charts/TKVJ3IJ4QHPE7IMGFZGCGTECNHBQQ6NEDXYHDYXSTVKHP65KXC3U5DKURCTLEQW3A4DXEH7A7IZL7PNMUDX7KE4G",
          "local_legend_enabled": true
        },
        {
          "id": 15804952,
          "resource_state": 2,
          "name": "Going-Oberndorf",
          "climb_category": 0,
          "climb_category_desc": "NC",
          "avg_grade": 6.4,
          "start_latlng": [
            47.515301,
            12.358302
          ],
          "end_latlng": [
            47.513993,
            12.363201
          ],
          "elev_difference": 27.1,
          "distance": 421.8,
          "points": "si_aHkvljALQVeAJYhAuALa@LaAf@qC@QG_@MWW]AMZaAToC`AmE",
          "starred": false,
          "elevation_profile": "https://d3o5xota0a1fcr.cloudfront.net/v6/charts/GXRIZK7BW55QRG3FNJB3SAWI4YIQH6DSPAKYKJH54M7QQGKRJIKUTXZ2N6DLGYCADGISR7CYL7XIK3T2E3BZNRA=",
          "local_legend_enabled": true
        },
        {
          "id": 15193805,
          "resource_state": 2,
          "name": "Paratri Uphill",
          "climb_category": 0,
          "climb_category_desc": "NC",
          "avg_grade": 1.1,
          "start_latlng": [
            47.472881,
            12.344493
          ],
          "end_latlng": [
            47.459206,
            12.357143
          ],
          "elev_difference": 22.6,
          "distance": 1828.9,
          "points": "o`w`Ha`jjAd@g@JQPo@Nu@Ps@Vo@bFeHlAsA^[bAo@xEeCdEsBj@_@jByAl@i@rA{AjBaCtAqBr@o@dBy@lGiBpBw@~BoA|AmAjBaBpAgBlC_EzEuF",
          "starred": false,
          "elevation_profile": "https://d3o5xota0a1fcr.cloudfront.net/v6/charts/3XJPTCXT5MTKEJWSSJWADR725L66VZ7ZMWVR2FUYFEDAO53GK2XC5JKTTFWXL5S6VOCUOIW2AGKEJXIDPB6GBI3D",
          "local_legend_enabled": true
        },
        {
          "id": 13670036,
          "resource_state": 2,
          "name": "Radweg St. Johann i. T. - Oberndorf i. T.",
          "climb_category": 0,
          "climb_category_desc": "NC",
          "avg_grade": 0.1,
          "start_latlng": [
            47.522236,
            12.40234
          ],
          "end_latlng": [
            47.505854,
            12.392303
          ],
          "elev_difference": 9.2,
          "distance": 2110.5,
          "points": "}t`aHsiujAL@NCfDeA~@WrAI`A?x@Lp@V~DhBnBj@x@\\b@ZLRZf@Vj@d@|Av@~CZz@V`@JL^N|@TJLHRFl@Lh@T^~@z@n@dAp@x@FRf@zBHPJLLHN@NAjBo@^I^C^@`AJnAZ^Nj@\\bFhDrCvA~BxAvAv@zDlBh@b@`A`Aj@`@zAp@v@`@|DjA",
          "starred": false,
          "elevation_profile": "https://d3o5xota0a1fcr.cloudfront.net/v6/charts/HM2WBXTQYXXHR2PPNFXYLNOXGCOVTV2NUYGU64SWNSE7KTIZKOMKR4HSPTBMOMCV5RKTELNR4Y4S2MC5LVGCUIWV",
          "local_legend_enabled": true
        },
        {
          "id": 9233482,
          "resource_state": 2,
          "name": "Fleckalmtrail ab Kreuzung Staudachstube",
          "climb_category": 0,
          "climb_category_desc": "NC",
          "avg_grade": -13.5,
          "start_latlng": [
            47.444142,
            12.344534
          ],
          "end_latlng": [
            47.449576,
            12.336441
          ],
          "elev_difference": 158.3,
          "distance": 1173.6,
          "points": "{lq`Hi`jjAKFGHk@lAe@v@{@Ps@FU?K@KFWr@MR?NINQl@@LHPDv@CVCJMXGFw@ZK?a@KSFQLE?UISDQ\\?`@EJKDc@ZMDY@OK_@FMAGEYC]]MA[BYZMDKLEPGNEb@Mf@Q^SBGLEl@WtAQnCOPET?RDF@JCLGOGEGNIFEBK@CBIb@EDGBSEEGUq@Bf@AZFj@Hd@Xt@P~AXnA?`@GZED]E",
          "starred": false,
          "elevation_profile": "https://d3o5xota0a1fcr.cloudfront.net/v6/charts/UXUYMQUKOHA6NQY57JRLE3FTRWW6NFKTF434XVXFSATZX2JS4AR5BSGVRPLQRS2YRKN43QR6GJ6DB3V2LPV54IQ=",
          "local_legend_enabled": true
        }
      ]

      console.log(bounds)

      // const data = $fetch("/api/strava/segments", {
      //   method: "GET",
      //   params: {
      //     bounds: bounds,
      //     activity_type: "hiking"
      //   }
      // })

      mapRef.value.updateSegments(segments);
    }
  }
}
</script>
