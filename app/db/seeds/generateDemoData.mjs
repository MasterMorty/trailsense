#!/usr/bin/env node

import { createWriteStream, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { once } from 'node:events'

const TRAILS = [
  {
    id: 1,
    name: 'Tourism Technology Hackathon 2025',
    pathData: 'ut{bH{monAWkBL|@`Aa@aA^WgBdAa@eAb@Ky@dAc@cAd@OcAL`Ad@QM{@Lz@t@_@O_Af@WNdAd@SOiAOoAe@VJx@i@TM{@',
    latitudeStart: 47.824362,
    longitudeStart: 13.027937
  },
  {
    "name": "Hahnenkamm Trail",
    "id": 105392355,
    "pathData": "evm`HwdojABAF@BBDBFBFDFHHFHBLDJFJHLBLBHBHCDEBEBCDADAHEHCJ@FA?GGEEC?GDCDAH?FAJ@JBL?J?HEJCJBJFHDLBJ@LAJ?JCH?HDF?F?F@D?@IEIGCE@EAAE@ED?F@D?BANODAH?FDHJFDFDH@HBF?@ICIIEGCCEAGBIHAHBJHHHJFHJHDHBHFHFJFFFDA?KCMGIEGCKCKGMGIIKIMKIOGMMKMKOKMIOKOKKKIIGCG@GH@HDJDLFHHJJJDJHHHF?BKCMGMIOIOGMGMEKGEIAIEKGKGIGIKIMIKKKMCK@MBMBMCKGKKKKIGK?GAGAECICGAEAC?CAGc@GMEMEICI@GBEDBBJFHF@?KEMEKCMCMAQEQGMGKGIKGKGKEIGMIMGOIMKMIGI@KDIJALBJBL?LBHDFFFADEHEHAJ@J@LAJ?J@HDHFJFFHHJHHFJDFDBBBF@F?FAFGE[GKGIEOEMEMAIPFNTDJHB@KKe@G]BINNJ\\HJFHDHDHJ[Mi@MY?IDBPVHLFJHHFDHAGg@Q]Q[OWAI?EFAB@DBFBHDJDJDHHJJJHJHH@DI@OGQIOKMIOIOIOGQGQEMEOEOCKAOCOCOEOEOGOKSKQYa@IOIOIKKMIMGMIOGMGMCK@EFAJDJFPJNJRJRHTJTJRJPHLBFAFSCOIKGIKKKKMOKMIKKIKIIIIMIMGKCMAKCKGGK?K@MBI?KE[K[CUYK[IGGEEEGEEI@IHKDMBSW]SSRQM]M]TERKEa@J_@Ge@Gg@Ga@A_@OeAKo@KWYUg@[UUWOYOWQWOUMUKYKUKSMUKQMUMUOUKOISKK_@OOJ@B@C_@Oa@K_@Kg@Me@Ma@KYI[G]GWG]I]Kc@Ge@Ie@A_@OU[QQOSWQQPKGYUOQUQIQL[@QMB[QEGHMJS`@KZMZIT?^AHCLALE^I`@I`@IVQTMRMTQNONQPMZQ\\[NQFQDYLY@MWCa@WJ@_@POA[Bc@J_@C[S?QPBa@Ha@ZSQSLQQ?SCQGPMVEPASSQILUUQWCQ?QFMRORK^KZMZKVA[J_@WJSPQNQFJa@H]H_@HYH]H_@LYLSLWF]JWYHOXOTWTMNU?YNWLUHSDWLSTM^K^Ob@SXOZU\\KZG_@@_@SFQVIXK\\SAOPDXB`@IZWDSASJMNSd@M`@MZGl@CXM\\K\\CX?e@QXG]JW@a@Ib@MVIVIb@Kb@UMQNIZS\\_@B_@ASLMPW@SMKYK_@Q[I[QOUIG_@SSOQQUUUQMSBHYSGBc@SEMRWNWGUEFi@VUTOKWYNSRQTI^A]Da@F[TSLUa@BYJ]LCSHKJ]Fe@Fc@OSIUQFWR[BUMS?YB_@BYE]G]EOEOCQAYGOQUAS@WPQ@YK]S[UYA]D",
    "latitudeStart": 47.42515,
    "longitudeStart": 12.37084
  },
  {
    "id": 108781978,
    "name": "Sommererlebnis Streif",
    "pathData": "k~m`HwlojAAbA@LEDED??@HDX?b@@f@DZ?@HSHMJKHEDED?@DETGNEN@@RBJBFF@DAHCHKNOJILILJFPLHF`@Fd@T`@TPJ\\NPDPHZNFTFFBBDb@Bb@BbB?`BAd@AZAfACpABp@?b@@ZX`CB~@Dv@Df@Dh@NbAJz@BPP\\PTTTDFLZVjAHNFHDBDBJDP@H@FBDDFVF^Nr@Jb@DPFRJPHFF@J?LARCDAF@@@BBJNDRFNDBBEBGJk@Jq@Jk@BOBIDI@ABA?I?a@Ba@Dm@Lo@Q]u@{AGYMs@Oo@GQIQMSQSMSEGEMMWKSMSIMMQK]G[Eg@Ac@@]Bg@BWDa@D]BQ?K?K?WEq@Cc@C[EUIMKGM?MBE@GAEACCCEAGAEAIAMAI?K@I@OBQDW@K@I?I?GCEACGCEACHCPMNMDO@OG[c@Y_@U]MQGQAGEMGSCGCIEm@C_@G]IQGMQUWWSIc@Se@QOG]WYYm@k@OAAK?_@@c@",
    "latitudeStart": 47.42646,
    "longitudeStart": 12.37212
  },
  {
    "id": 110327715,
    "name": "7 Rund um die Hohe Salve",
    "pathData": "uyq`Hy}rjALu@^`AFTTn@BPEFFD?Cs@CVr@HVJbAMh@aAhDy@zAcBhC]j@c@jAc@vAaAzA{BjBs@rAYbA{@vDqAlBq@f@kA`AWZi@|@s@pBa@dCEp@ItCYhHw@vIcAtFiAvDgCpHsChI{@fDkAfE}@dD}@|BQ`@yAjFeAnEoAtFgAdByAn@YEmBIuBf@{A`Cg@bC]rFDnCT`FHnBJdAKz@a@p@?JHV`@`Az@xAb@fAz@dAd@j@HbAA\\EtG@`AU~BE^?fCHdA@bELzBThDb@bEFj@F|@Ld@Tv@P?PSb@PJ`ADVv@hC`A`DdAbE`@dCVrCPtBh@~@p@l@t@zAV~@l@pBRx@Nj@DVFT@?Lj@TbA\\xAn@~CP`ABHQV_@?Ok@Mw@a@HDzAl@`EJbEV`E`@dFj@lCnAhEbAbENbAXbDf@xG\\bFl@pHPjCP|BXnCj@vEpA`Ev@|BjBnF~@vDt@`FP~BJxAJpAIfAQd@ARCr@HlBRt@R[Nr@RxC@dA]hBSPoBdCwB|C]t@eAvCiAhEIZcAlE{@vDOzBEhEKbCYdEAf@L|CTjAV|@b@Zf@GjCOnD?xCCn@Dz@`@NHp@Th@p@BdAS`A[`EAvACzFPzBl@rCNfDMnGYnBg@p@oClDW~A?b@BtFFrFDr@@tBEv@JbCF\\~@xD`AnDx@xCdBxGXrBDfB@VFxAB|BJlENbDt@xDr@fDFb@N|AXl@NDt@Pn@|@Ef@Q`CGxDItBEp@?nBBbD?^DbG?|@UpBiAhFIZ[hCSrBk@dCaAnDs@jF[fCs@jBuBpDeAdDGRIb@@?^^b@n@XlBQdAUbBAr@DlETdAZ\\j@f@Vp@Av@DpDTlEBXTd@d@MXFDr@?n@^lApA|ATVRp@DnAJ|CJ|BErDMtFMjCC`@Kj@_@GaAWMEg@Sg@DOz@BvALv@z@pDtA`Fj@hBd@rCp@fChAxEt@nEVnD^fHL~DPzCVtBj@xATRtBdCjBjCfA|AlBbDr@lAj@vBfA~Dt@nBZv@PXX`@x@bB^z@T`@h@~Al@zBHZJZZv@l@bBHX~@vA`CpBpC|AbD|ArCl@zAl@THt@hAv@jDdAjCxAlDd@zAThC@fACbA?`ARzCh@lFb@nBTn@B@BHDL\\\\dBx@x@f@dAnAf@dAZz@x@hAh@r@r@`B~AxDdArDxAfDbAlB`A|B`A~AzChEhCjDf@j@TVVZr@v@`ArBfAlClBhD`AfDzAlGnBdH~AlFl@fBXbB@d@NfEFnDC~E?vAQbDy@~CWrAXv@XLPJh@^\\PdASl@Ap@BhBp@vAbA~@Qz@{@tBmBl@m@bBk@ZBlC]fAg@LSVg@j@w@NARd@Bt@Vx@~@@j@Fl@`@fBfBPP\\NZQv@_@t@a@j@q@`@?BRM\\MTy@~Bg@~@_ALkAOcBs@iBIkALeA^iApB}AdDg@v@kA`@kDf@sCdAqATgAe@UWsA_AgAFe@p@YfAYnDCtB}@lFc@bB]~@c@f@q@n@_Bb@[DcDlAwCpAm@`AI`@YjAQNmBpD}AvBcCfCuBpCkAbBORcAr@iBhAkB`ByB`DeA`BkEfF_CnCYZgApCw@tCkAbBsARmER}Bl@gBnAy@zAgA|BKTQrAIb@EFBTDLbA|APbBDvDZbBOpCo@r@{BbDmB|ByAdAwDdB}AnBi@vBgA`DmC~DmArAwApAwAdAoALwBXc@TyAH{@RsAlAq@HUM{AJMZM\\gBrEyAvDiCfGeBfCoAtAwCtCYTuCzAyA|@u@t@iAdA{@v@aAz@eAx@qBnAwBbBiCpCeCzBmB`BcCpBq@Lw@Sg@BcBbAk@RyAz@gAX{Ax@_AdAaBbB_Ac@YaAWkAFOFi@SCa@b@AlAH`Bd@nDFVI`Am@Ru@p@MZ{@fAi@H_AOkAeAsA[{@^i@DoBDsBZUMaBo@gAeBEe@c@}CgAyBmAm@{@C{@XoA~@YZeDfFgElGqApBoAh@OEQYM_@I@SNeA[wB_BoBqBuCaDmCwDkC{FyBoEiCqBgE}BuCuC_FwEmAs@}Ba@wARsAn@cB|Bu@dA}@\\aB^e@G?EEIi@}Ai@}AsAoCq@iAiCwDmCyDaCiEuAyD{@oEm@mGa@qFM{Ao@_FeA}EoA}CcBmC{BsBgE{CsIqG}C}CqDyE_BcCW]IKQD_@Oq@gAeAkASQoB_BiB{Ag@g@[@y@Dq@YeAiAOYqAeDsA}BmAoAi@c@{BcBw@k@i@S{@g@gBcAgAo@SOeBeBi@g@oA_CgB_CqAyA_@[qAs@eAmA[_A@u@RmBVsCLiAKmCsAeGGa@QoDG}@a@gBYy@_AiB[kBT_AZ{@lAoDP_AJcB?a@C}B\\sA^e@z@gBh@aBlA{A|AcA|@e@VSBI??WiAi@}@{AiCaCyDgCyEK]WaCWsEEwB?mC_@sBMYq@mB_@iCk@sD}@oEo@cBq@oA]w@S_AGg@CwAC_AIgA[}Bg@}A_@{@SuAUqCC_@KgDM}CI}@e@}Ei@yBgA{D_AiEeA_Di@yAaAiBkA}AyA{@i@a@g@}@O]s@s@o@a@{Ao@}Ay@aA[sAm@eBgBsAqBm@eC?g@KwDAs@Uc@]IGQ_A_CsAwBwB_DeCqD_C}Dk@uAcAcE_@}CUwEi@wHk@eEkCyQuAkJ_A{HYmGCwEPwGb@sGBgDOgDSkBaBmHsAkHYoEi@oHm@sDw@mDs@sEUiCPw@HIt@uB@c@N{DVyDJ{DAwBFkFl@yDHe@ZkBLmC?qFFsCCaAW{AS}A@{CP{GJ{H@kGS{ESaFJiDNoGQ_Dg@sCw@kD]cBa@mCY_EIwAEcBAeAHqARgBReA\\qAd@kAJSLU^s@d@}@`AmB`AgCv@eDr@mDz@wD^yArAiEbBgFn@sBrAgExB_HfAkDtCaJPk@nAiEp@}CHa@z@aBr@cAh@sAvAaCnAwBLSv@]PEBAAq@a@sCKeBOwCC[EiC?mBd@kDHc@F}CEi@YoFGkAGgCEaBKwDAmAZqCHa@FaCGmAAI@OESAg@@w@ByALeDHoEA}B@{A?]KwDSaESwBO_B]aEOcD?mB@mEJeEDyASeBa@yBIeACs@Go@Wu@c@eBMuABk@Hy@IgBEc@MqAAiC@cEDoETyHR{GBgBBsBLsBPsDDeEOoGg@eFi@kE[mCMgDA{DIaCCYVoATs@D}@F_Aj@eCp@eDz@iEx@mDz@oCzAaBp@mAFoAKoABqBj@cAZg@dC}EXo@x@}AnCgCh@O~IuBlEiA|Dw@b@KxAgA|AaAb@KbAQfB{AtA[JZjBlCnBdBxC~Br@hATd@d@pCDlB@hEv@pB~@Wr@a@vAc@xAxAD~AFrCErHBl@b@dAx@ZV?|@s@`CcAdAKnC@vCh@lFjAtF|AfDx@tEn@bDr@|BDbHJvDX~A?XAd@\\Bp@V~Cf@zCd@xBvAfCvAbAfBZhACjH}@vCOnB\\vEdBzAb@rCRxDBtBp@nCbA\\FlC?zBGtBNp@HdCYfBNfD|@tAKt@aAVaATgAdA}BnBsCtCmDnBsAxAs@bHkDnCeBfCiCvC{DzAgBzAcAdCw@nDcAvCkAvCmBnCoCzB}ClD{EvCcDx@_ANy@CU]cDYwEAaENqCd@gClAgCrAu@|AG^BtANz@]t@gAn@aBtAmG\\{Ax@eD`A_D`AiClAcEdAyD^wAf@cBp@oBjAiDfBcF`BiF`AuEj@{Ej@oHPaFT}DT}AfAuC`AgAlCkBx@gBHa@PaAj@_CL[p@eAxAoAb@]r@mAHUR}AfA}AjAkB`AsBh@mBZsAJM@A@OEa@[i@KUUq@AKGUQP?AAGAA@?UMKQA]",
    "latitudeStart": 47.44619,
    "longitudeStart": 12.39021
  },
  {
    "id": 117356258,
    "name": "Bauernhaus-Museumsweg",
    "pathData": "wsr`Ha|sjADTFTFLFH?@FJHL?@FJ??@BNCP?LGFANGBTJX?@Jb@H\\@@DPDT@?@P?B@b@@X?D?V??B`@?PDN@NFLSNUXUTSRQNA@WLA?QRA?WP_@J??WH??SF??SHKBYL_@LA?]LA?YL??_@JYF]Hc@H_@H??YFYDC?WFa@Ha@J]H??UFYDA?]JY@]@[?UA?@K?A^?h@B^?BDh@c@H??c@NC?a@JA?i@RC?A?o@Pe@PA?c@LG?C@[Ng@J]F[Em@Eg@CWCc@A_@AO?K?WBYDA?WDA?YBSBYLYHWL_@L[\\]f@Y\\WZ[`@QZ[d@_@d@U\\U\\[\\]XWR[JWB]?YC_@?]EAAY?]GQ@SCSCSCSAYAUEUBA?YAA?W@??]BWBYB_@F[@a@H??U?Y?Y?U?WIS?AAYEOE_@GUESCQCS???MCS@[H]HONQTOVKXGXE[QEGCGGQFA?MNIVCNMNOBO?OM?AMWOUQWOSOQOSS?AAOA?@Q?UEA?Q?Ea@EWC_@EQA]@a@Ak@?g@Aa@A]A_@AW?[C_@?c@@e@@[Do@Ba@Ba@Ba@?C@k@F_@@W@?@Y?KL?RAPCRATGTE@@T@RJZNXD?@T@R@VAVC\\ED?DAZAR?@?XCVCVMTKPKVM@?VQ??VK@?LKPGT?TAZA\\GR?TCX?ZE@?\\E^G??XE@@ZGZMZG??ZOXIA?RIPCPBPPRLNPBBPJ@?NN??RNNHTBX@ZE?ARG@?\\M??XGVI??^I`@O@?XG@?XG@?RITI?AVK?@NM\\YXSRSRSVU??TWPO??ROTOTQ??XSXQTQZSZSTKPKVKl@[\\Sb@Q`@QZK`@Sb@OVI`@SVGZOZOTKVORMPQRYV]TYPWRWTWZk@Ta@RYJITQTYR[NSXQ^ERGL?LBR@^E^CTBRDXLZHXJLBRFLBRC@?N@LGB?RO??NBPAHHL\\HVJX@@HP?BN\\H^DPJTHN[TQT?VBR?@@N@T?@BR?N@L",
    "latitudeStart": 47.45036,
    "longitudeStart": 12.39505
  },
  {
    "id": 121300841,
    "name": "Ganslern Trail",
    "pathData": "{rq`HetrjAG?G?K?A?AE??AGEYCGEYCKCMABGBI@G?GAIEKIEJEHCFCD??EDCFAJ?@CHADU`AENOj@GN??]bA?@QXq@dAiAlBi@z@AFQh@IXGVGPGTGTGLQXGFIHMJSPo@VOLGFQLKLKNIJEHGHEJKPIV??Qn@IXGXIVG\\Gb@EVIVOTk@z@OVMPs@b@o@j@i@f@_@h@SZMZM^M\\Kb@Mn@K|@Ez@Ez@CfAAn@CXGd@Kd@ATF@FBCh@Cj@IbAM~AO`BKpASvAId@Ov@SfAQp@[nAi@xAk@`Bm@fB[|@[|@[~@Yx@Un@KXENGDGFIRKTO\\ALNPDH@?@AJ[@E@A@?B?FFHHJH@D??@D?HAFCDC@GBEBCD???BDBHBFCHCDDDB@BD@BA@?B?@CBEBE@CBEBEBE@G@EBC@EBABABCBAB?B?D@FGDCBEBCBCBADC@ABABEDEDABC@AFCF@BF?B@H@HBDD?D?D?B?D?BDFDBBBBBCBABIBCBCDCBF@D?DGFHHJJNHJALGJYHe@Ji@Pg@Xg@Tg@Zm@b@mABEJi@`@kA`@oALi@Hg@BEBEPQLO\\]N[RUXW\\g@Vg@DILWN_@RWLMZ_@Vg@Vc@NYHc@HQHGVQJGl@_@NKTGNCPB^IP]d@cA^KZm@T{@VwA?K@MBSD[DQLHRTPb@@DLJPTVZT^FLDT@n@N`ARl@TNNFBS?QDOLc@B[@O@O@W@_@BMDKHAF?L?VBJBNBXLN?LAHELIVUPMDCFCH?FBBD@D\\Kn@WZOLGFIBSBe@BYBGDGPKHIDGFQPUb@_@TYPUPYJY@IDQXETWPSBGBGF???BW@EFKBO@E?????A?@LMBCBEBCHKHOJMHQN_@LYLa@Pk@Va@XYX]PWJSFGHKNMLMJSJWDSD[DU@IDGJMHGPIRIRGDEBE@I?[GaAUCMEKCKIOQOQKQIOOYCGCE??GQMW??Ua@_@g@MQIMMA??QCMC]IG?IAEAGCIKGMMSQ]ACACEICEGMUe@Sc@Ue@g@eAUi@EG??KUQ_@??MUOYu@kA]q@_@o@_@o@??????ISCCAAIQCE?@????????????CDGNOZCF???@CB?B??????IL?BA@??AB?@g@fAIR??MVGNMX??INADGNG@EBGDEJE?A???ACAACA??EE??ECA?GEMGOKIKGEEEEGEKK[EKGM?A????CG@?J?F?F?",
    "latitudeStart": 47.4451,
    "longitudeStart": 12.38867
  },
  {
    "id": 121300844,
    "name": "Malern Walk",
    "pathData": "{rq`HetrjAG?G?K?A?BF?????@FLBD@DBF?B@@@D?@@@@B@B?@BDDF@@@??@@@@@BB@?@B@@@@BBBBDBDBDBFBBBB@@?DB??@@BB??@?@@@@????@B@?@?B?DKFEDCFABGBG@EDGBG??BEBGDKBEBIBEDIBE?A????DIBITg@LYBE?A@C??@A?CBEDG???????CBC?A??BG??N[JU?????ABD??@B?@@@??BD@??B@@@@@@FM@CHQVo@`@cAZy@Pc@N_@JUDMFOFMPc@LYb@iAFE@ABEFMBGHQHUVk@N_@BI@?HUN_@FOPg@HSFMFBN@BMJg@Ha@HYBKLc@Jg@Li@FUJe@Lc@FYLFLDL@`@@ZCb@El@OVIT@H@\\PPLJFJDTDt@PVD^FLD\\LF@??BEFGBIDYBYAIAKEYCIGKN]JOJMt@o@x@o@h@a@ZSXWPO^Wh@]VUp@o@TSPMNKn@SNGHE~@e@^ONEZGTEJCLEb@SPIVQXSNMT[b@u@Te@\\q@L[Nm@J_@Nc@DIFMFMBIBCGg@Mu@?G?ELi@FQ@EPQHKHSPo@F[Di@?O????FENMJEFA`@@LA@A?A@KCi@KsACYKsAGo@?CBABAL?R?PBJ@LDJBLCHCJIGOCIAMCWCOASCCAQCSEKyAp@m@VuAn@a@J??Oy@EQSo@KYSc@GYWiBEWEOm@gAUc@m@aAg@Tk@ZSLEBOHi@XWPUNA@OLSPUT??STWZSVUZEHEHKPKRYn@GNABKRMZGRKXEN??MQMOKSYaAACWc@y@iA_@i@IQCQ?IID[RSJ@JD`@@d@?RARCHEHEHIDOD{@POJQN??BDDPEQ??DPLRJT??FJLRNVPRNR??????@@f@p@Tb@Pb@F^@VAXSD??IZYj@_@d@????U^SVRWT_@????U^k@r@V[WZW\\SPOLOHIBSFUDc@Hq@NOBe@N??E@A@ABADAD?R@D?@BAB?@BDBBBBFBBBDDD@DFF?F?N?JANC?K@CJITGC??I`@Kb@Qp@Od@AJ?B?D?H?N@VBPBPFLZn@N\\FX@P?XATCNGRKPMLQNQPMPGLCFIVKp@?@QjAQz@ERQt@U~@GXMb@Kd@GTI`@CFKf@Mb@CJIXEVCHKf@CLGAG?GCGLIRQf@GNO^O^O^]x@CFIPCFGLCDA@GDc@hAMXQb@GLYr@a@bAKVq@dBWn@IPCDEJCCAA?CA?CE??AA?AAC??CE?@CDABEJSb@CHEFCD?BA@EJMXUf@CHEH?@CDEHGNCDEJCFCDCFEFADCFCFG@EBGDEJC?C?AC??AAAACAAAAA??ECIEGCECECECCCCCAAAAACA?CCAAAA?AA?AAEGCE?AACACAA?AAEAA?CCGAECEGM?ACG@?Z?",
    "latitudeStart": 47.4451,
    "longitudeStart": 12.38867
  },
  {
    "id": 121300847,
    "name": "Schwarzsee Runde",
    "pathData": "cxs`Hw`njABUAa@C_@@a@DS`@M`@GRC?????????????@HB@@@?@@????TRDB@QBSTqAVaA??f@gBNc@NYP]Vo@Ro@F_@????Rs@Nm@ZcADKZ_APs@XiAP{@Jc@Da@??MOGGEGCCOQAAAA??AAGIIKEEMOGICCAC??A???EGY]GIKO_@_@??gAY????????????OKIQKSOG[KKCc@]OK}@AYMMGg@KKu@Iq@ASEWIOCMKYCSAIEEQBm@XYREFQRQVKP@N_AN??qALMJEFGJWVWXKHID[JODQFIFEFIRMj@IZCL??AF?@AF@J?J@F@H@D@DDH@D@@????f@fAXn@Pb@?B?BAD]t@Uf@e@bAYj@Yn@[dAc@rAOd@IVCHOf@?@A@CFA@CFIPGLGLGLKPKN??S^OX??ADCNGh@CRANAZ@ZB^BLFRLXV`@\\b@FFF@H@NCJOHENK@C@?BE\\]TSh@e@TWLIVQXBHAFAJCB@?FAJEX?F?D@DBJb@vA`@lA@DL`@FHB@@BB?F?DAB?B?D@DAp@MpAS@?HA`@IPCD?D?H?J@j@FD?d@DB@N@P@D?@?D@",
    "latitudeStart": 47.45618,
    "longitudeStart": 12.36508
  },
  {
    "id": 121300850,
    "name": "Steuerberglauf",
    "pathData": "cxs`Hw`njABUAa@C_@@a@DS`@M`@GRC??LF@@ZV????@QBSTqAVaA??f@gBNc@NY??FIHSVo@Ro@F_@Rs@Nm@ZcADKZ_APs@XiAP{@Jc@Da@??MOGGEGCCOQAAAA??AAGIIKEEMOGICCAC??A???EGY]GIKO_@_@??gAY??????OKIQKSOG[KKCc@]OK}@AYMMGg@KKu@Iq@ASEWIOCMKYCSAIEEQBm@XYREFQRQVKP@N_ANqALMJEFGJWVWXKHID[JODQFIFEFIRMj@IZCLAF?@AF@J?J@F@H@D@DDH@D@@????f@fAXn@Pb@?B?BAD]t@Uf@e@bAYj@Yn@[dAc@rAOd@IVCHOf@?@A@CFA@CFIPGLGLGLKPKNS^OXADIGKQCKEWEO??CKCMKUm@LMHOLC@??A@????UP??OLIHC@EFGDQLABC@A@CDA?A@?KDa@Fq@B_@AMAUEM??ESMk@Ig@E_@C]A[Ag@A]Gm@Fl@@\\@f@@ZB\\C]A[Ag@A]Gm@Ea@I[GG?G?EAIAMIWOi@Ka@EUAY?UBm@Bo@@O@ODYFm@De@D]BW?Y?OAKAQCQG]Ki@EUAO?K?K@[@a@@m@Cg@??ACAGWc@MWEICKCOAW?W???_@??NBF@D?D?FCFEEKCKOe@Us@AK?I?MBSD_@BWBO@[GyASk@[g@??a@kB??Cg@??Ba@Bw@@QBU@G@QEWCGKIMGIIISMUCEIMMCEAMDSJSJG@KB{@Ja@BMEQEA?C?E?E?I?GASCGEK?G?I?G?G?G?GAG?G?G@G?C?G?C@C@CDCBCBAD?DDDB@B@B@F@B?B?BBCDC?EBCBC@ABEDEDCBA@EHCH?FD@F@D?BAF?B@B@BB??B?B?BAB@B@DBADADAFCDCHCBEBCBCB?H@H?H?FAB?D@FCFC@AFADABC@ECE?E@E?C?E?C?C?E?E?C?E?yA\\k@RYN[JMBMF[P]NMF_@NG@SG_@OWOSFCHITGREPALAJAB_@EIAM@I@GDQLKFOFWFg@Lm@JMDWF]Jc@Ju@Fm@Hk@Nw@Vk@JWN[Ta@^??eAxB[l@S`@GDO?QCOAMDOP??QTUv@Oz@K|@Or@Mp@Ef@C`@EZERGNMZGHMHOBOBWAOAWMMGIGOCM@QB??MDGDEHCTAV?L@LBRLZJT^`@VXZb@??h@p@NRPRPNJHRL`@XPNNJJHRR`@h@\\f@NPFFTLXRf@\\j@d@f@\\HHBBDFBHBLDb@Dr@NGHCFAD?H?`@@b@A@Z@VCPANGN_@h@MNIPGNGROl@??a@~Ak@zAYv@GLGLCHCL?J?H?DBJBD@H@DBJ@H@N@T?\\???DBB@@B?@D?j@??WHIDC@CBEBEFEDEJENIBO@AFEJEL??EJCLAP?TBPJb@X|@BNDRBNF\\Hf@Bb@BZ@`@B~@@VBRBNFVDJFNLNDHLj@Jf@JZLXJPJLRTRRHHHDJHPLPHJJHLHRBJ@F@D?DBHBJ@LBR@P@^?JBH@JBP@DHTFLDHFJHNNTJRP^N^L\\Pb@HNFHHFJHHDn@VZLv@XVJJFNH\\ZHDLDLBH@J?F?J@F@JDLFJJFJHNP\\FLDJFFLLLHLFRJNBJ@J?FARCFCD@B@@D?D@HAFCHCBKNc@d@EHCDCPANEXCZAN?JDJZVNNHFHHDHTvARhA^xARr@Rp@HT|@{@????NGXOBA^ORGRG@P@HBF??DLFPFPLZHPFVHTDLFLHJHHNLNLVPPJPH^LZJXFNHLHJHNLHHHNFLDLDH@LFGBEBIBMBQDUDUL]FWDQJg@Hi@BOFc@Ng@Rq@Rm@Pm@Lk@PiA@K?IAMCQCMG]Mk@??`@_@`@a@HIZ]Z]D@B?DCJIHKTYVYX]JM?DBDB@@?B?@ABC??RYb@m@Ze@Za@V[ROr@q@b@_@\\]f@e@LOFIDIJ]FMFIn@q@`@a@b@a@VULM??NMTOFGDE@EBQ@S@G@G???I@K@E?E@E?C?C@G@E@E@G@EBK@G?A?C??@E?A@GBI?C@IBK@KBG@E@MBKBMBMDI?C@CBIBUBS@C@IB[NsAJk@N_AZ}ATgATcABMPs@@EBMAKAGIIQMFKHW@C??BIBKASFOL[Pk@Lk@Ly@D[@]?[AWGQ",
    "latitudeStart": 47.45618,
    "longitudeStart": 12.36508
  }
]

const VISITOR_PATTERNS = [
  {
    label: 'Early Birds',
    morningPeak: 7.75,
    dayPeak: 13.25,
    eveningPeak: 18.25,
    morningSpread: 1.4,
    daySpread: 2.1,
    eveningSpread: 1.6,
    morningWeight: 1.35,
    dayWeight: 0.85,
    eveningWeight: 0.9,
  },
  {
    label: 'Day Trippers',
    morningPeak: 9,
    dayPeak: 14.25,
    eveningPeak: 19,
    morningSpread: 1.8,
    daySpread: 2.4,
    eveningSpread: 1.7,
    morningWeight: 0.8,
    dayWeight: 1.3,
    eveningWeight: 0.85,
  },
  {
    label: 'Sunset Crowd',
    morningPeak: 8.5,
    dayPeak: 15,
    eveningPeak: 20,
    morningSpread: 1.6,
    daySpread: 2.2,
    eveningSpread: 1.3,
    morningWeight: 0.9,
    dayWeight: 0.95,
    eveningWeight: 1.45,
  },
]

const DEFAULTS = {
  days: 30,
  slotMinutes: 5,
  maxVisitorsPerSlot: 15,
  globalTrafficMultiplier: 1,
  busyFactor: 1.35,
  calmFactor: 0.75,
  output: './db/seeds/demo.sql',
  seed: undefined,
}

const args = parseArgs(process.argv.slice(2))
const config = buildConfig(args)

const rng = createRng(config.seed)

async function main() {
  const outputPath = resolve(process.cwd(), config.output)
  mkdirSync(dirname(outputPath), { recursive: true })
  const writer = createWriteStream(outputPath, { encoding: 'utf8' })

  const writeChunk = async (chunk) => {
    if (!writer.write(chunk)) {
      await once(writer, 'drain')
    }
  }

  const slotDurationMs = config.slotMinutes * 60 * 1000
  const slotsPerDay = Math.floor((24 * 60) / config.slotMinutes)
  const totalSlots = config.days * slotsPerDay
  const startArg = typeof args.start === 'string' ? args.start : undefined
  const startTime = getStartTime(startArg, config.days, config.slotMinutes)
  const dayWeather = buildDayWeather(config.days)
  const nodeProfiles = buildNodeProfiles()

  await writeChunk('-- Auto-generated demo dataset.\n')
  await writeChunk(`-- Generated at ${new Date().toISOString()}\n`)
  await writeChunk('-- Adjust parameters via generateDemoData.mjs CLI flags.\n\n')
  await writeChunk('BEGIN TRANSACTION;\n')
  await writeChunk('PRAGMA foreign_keys = OFF;\n')
  await writeChunk('DELETE FROM activities;\nDELETE FROM nodes;\n')

  await writeChunk('\nINSERT OR IGNORE INTO trails (id, name, path_data, latitude_start, longitude_start) VALUES\n')
  for (let i = 0; i < TRAILS.length; i++) {
    const trail = TRAILS[i]
    const suffix = i === TRAILS.length - 1 ? ';\n\n' : ',\n'
    const name = escapeSqlString(trail.name)
    const pathData = trail.pathData !== undefined ? `'${escapeSqlString(trail.pathData)}'` : 'NULL'
    const latitude = formatNullableNumber(trail.latitudeStart)
    const longitude = formatNullableNumber(trail.longitudeStart)
    await writeChunk(`  (${trail.id}, '${name}', ${pathData}, ${latitude}, ${longitude})${suffix}`)
  }

  await writeNodes(writeChunk, nodeProfiles)
  await writeActivities(writeChunk, {
    nodeProfiles,
    dayWeather,
    startTime,
    totalSlots,
    slotsPerDay,
    slotDurationMs,
  })

  await writeChunk('PRAGMA foreign_keys = ON;\nCOMMIT;\n')

  await new Promise((resolve, reject) => {
    writer.end(() => resolve())
    writer.on('error', reject)
  })

  console.log(`Seed file created at ${outputPath}`)
}

main().catch((error) => {
  console.error('Failed to generate demo data:', error)
  process.exit(1)
})

async function writeNodes(writeChunk, nodes) {
  await writeChunk('INSERT INTO nodes (trail_id, status, ratio, battery) VALUES\n')
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    const suffix = i === nodes.length - 1 ? ';\n\n' : ',\n'
    await writeChunk(
      `  (${node.trailId}, '${node.status}', ${node.ratio.toFixed(3)}, ${node.battery.toFixed(3)})${suffix}`,
    )
  }
}

async function writeActivities(writeChunk, context) {
  const { nodeProfiles, dayWeather, startTime, totalSlots, slotsPerDay, slotDurationMs } = context
  const batch = []
  const batchSize = 900

  const flushBatch = async () => {
    if (batch.length === 0) return
    const values = batch
      .map((row, index) => `  ${row}${index === batch.length - 1 ? ';\n' : ',\n'}`)
      .join('')
    await writeChunk('INSERT INTO activities (node_id, ble, wifi, temperature, humidity, created_at) VALUES\n')
    await writeChunk(values)
    await writeChunk('\n')
    batch.length = 0
  }

  for (const node of nodeProfiles) {
    if (node.id === 1) {
      continue
    }
    for (let slotIndex = 0; slotIndex < totalSlots; slotIndex++) {
      const slotTime = new Date(startTime.getTime() + slotIndex * slotDurationMs)
      const dayIndex = Math.floor(slotIndex / slotsPerDay)
      const weather = dayWeather[dayIndex]

      const stats = buildSlotStats(slotTime, node, weather)
      batch.push(
        `(${node.id}, ${stats.ble}, ${stats.wifi}, ${stats.temperature.toFixed(1)}, ${stats.humidity.toFixed(0)}, '${formatDateTime(slotTime)}')`,
      )

      if (batch.length >= batchSize) {
        await flushBatch()
      }
    }
  }

  await flushBatch()
}

function buildSlotStats(timestamp, node, weather) {
  const hour = timestamp.getHours() + timestamp.getMinutes() / 60
  const weekendBoost = isWeekend(timestamp) ? node.weekendBoost : 1
  const timeFactor = computeTimeFactor(hour, node.pattern)
  const nightFactor = getNightFactor(hour)
  const weatherTraffic = getWeatherTrafficFactor(hour, weather)
  const slotVariance = randomRange(0.85, 1.15)

  const expectedVisitors =
    timeFactor *
    nightFactor *
    weekendBoost *
    weatherTraffic *
    slotVariance *
    node.trafficMultiplier *
    config.maxVisitorsPerSlot

  const baseVisitors = Math.max(0, expectedVisitors)
  const visitorStd = Math.max(1, baseVisitors * 0.35)
  const ble = clamp(Math.round(randomNormal(baseVisitors, visitorStd)), 0, config.maxVisitorsPerSlot)

  let wifi = ble
  const prefersBle = randomRange(0, 1) > 0.15
  if (prefersBle) {
    wifi = clamp(ble - randomInt(1, 2), 0, config.maxVisitorsPerSlot)
  } else if (ble > 0) {
    wifi = clamp(ble - randomInt(0, 1), 0, config.maxVisitorsPerSlot)
  }

  const temperature = computeTemperature(hour, weather)
  const humidity = computeHumidity(temperature, weather)

  return { ble, wifi, temperature, humidity }
}

function computeTimeFactor(hour, pattern) {
  const gaussian = (peak, spread, weight) => weight * Math.exp(-0.5 * Math.pow((hour - peak) / spread, 2))
  const combined =
    gaussian(pattern.morningPeak, pattern.morningSpread, pattern.morningWeight) +
    gaussian(pattern.dayPeak, pattern.daySpread, pattern.dayWeight) +
    gaussian(pattern.eveningPeak, pattern.eveningSpread, pattern.eveningWeight)

  return clamp(combined, 0, 1.35)
}

function getNightFactor(hour) {
  if (hour < 4) return 0
  if (hour < 6) return 0.2
  if (hour >= 22.5) return 0.05
  if (hour >= 21) return 0.25
  return 1
}

function getWeatherTrafficFactor(hour, weather) {
  let factor = 1
  if (weather.rainy && Math.abs(hour - weather.rainyWindowStart) <= 1.5) {
    factor *= weather.rainyImpact
  }
  if (weather.coldSnap && hour >= 11 && hour <= 16) {
    factor *= weather.coldSnapImpact
  }
  return factor
}

function computeTemperature(hour, weather) {
  const minutes = hour * 60
  const progress = (minutes % 1440) / 1440
  const shifted = (progress - 0.125 + 1) % 1
  const heatCurve = Math.sin(Math.PI * Math.min(Math.max(shifted, 0), 1))
  let temperature = weather.low + (weather.high - weather.low) * heatCurve

  if (weather.rainy && Math.abs(hour - weather.rainyWindowStart) <= 1.5) {
    temperature -= randomRange(1.5, 4)
  }
  if (weather.coldSnap && hour >= 10 && hour <= 17) {
    temperature -= weather.coldSnapDrop
  }

  temperature += randomRange(-0.9, 0.9)
  return Number(temperature.toFixed(1))
}

function computeHumidity(temperature, weather) {
  const span = weather.high - weather.low
  const relative = span === 0 ? 0.5 : clamp((weather.high - temperature) / span, 0, 1)
  let humidity = 45 + relative * 45 + randomRange(-5, 6)
  if (weather.rainy) {
    humidity += 5
  }
  return clamp(Math.round(humidity), 35, 98)
}

function buildDayWeather(days) {
  const patterns = []
  let baselineLow = randomRange(2, 8)
  for (let i = 0; i < days; i++) {
    baselineLow += randomRange(-0.4, 0.4)
    const low = clamp(baselineLow, -4, 14)
    const span = randomRange(8, 15)
    const high = low + span
    const rainy = randomRange(0, 1) < 0.28
    patterns.push({
      low,
      high,
      rainy,
      rainyWindowStart: randomInt(11, 17),
      rainyImpact: rainy ? randomRange(0.55, 0.85) : 1,
      coldSnap: randomRange(0, 1) < 0.18,
      coldSnapImpact: randomRange(0.75, 0.95),
      coldSnapDrop: randomRange(1.2, 3.8),
    })
  }
  return patterns
}

function buildNodeProfiles() {
  const count = TRAILS.length
  const nodes = []
  const busySlice = Math.max(1, Math.floor(count / 3))
  const calmSlice = Math.max(1, Math.floor(count / 4))
  const statusPlan = assignNodeStatuses(count)

  for (let i = 0; i < count; i++) {
    const pattern = clonePattern(VISITOR_PATTERNS[i % VISITOR_PATTERNS.length])
    const trail = TRAILS[i]
    const categoryMultiplier =
      i >= count - busySlice
        ? config.busyFactor
        : i < calmSlice
          ? config.calmFactor
          : 1
    const trafficMultiplier =
      categoryMultiplier * config.globalTrafficMultiplier * randomRange(0.85, 1.15)

    nodes.push({
      id: i + 1,
      trailId: trail.id,
      status: statusPlan[i] ?? 'healthy',
      ratio: clamp(trafficMultiplier, 0.5, 1.5),
      battery: clamp(randomRange(0.55, 0.95), 0.3, 1),
      pattern,
      weekendBoost: randomRange(1.05, 1.35),
      trafficMultiplier,
    })
  }

  return nodes
}

function assignNodeStatuses(count) {
  if (count <= 0) return []
  const statuses = new Array(count).fill('healthy')

  const offlineIndices = pickUniqueIndices(count, Math.min(1, count))
  offlineIndices.forEach((index) => {
    statuses[index] = 'offline'
  })

  const availableForBattery = count - offlineIndices.size
  let batteryLowCount = Math.round(count * randomRange(0.15, 0.25))
  if (availableForBattery <= 1) {
    batteryLowCount = 0
  } else {
    batteryLowCount = clamp(batteryLowCount, 1, availableForBattery - 1)
  }

  const batteryLowIndices = pickUniqueIndices(count, batteryLowCount, offlineIndices)
  batteryLowIndices.forEach((index) => {
    statuses[index] = 'battery_low'
  })

  return statuses
}

function pickUniqueIndices(poolSize, desired, exclude = new Set()) {
  const result = new Set()
  if (poolSize <= 0 || desired <= 0 || exclude.size >= poolSize) {
    return result
  }

  const target = Math.min(desired, poolSize - exclude.size)
  while (result.size < target) {
    const candidate = randomInt(0, poolSize - 1)
    if (exclude.has(candidate) || result.has(candidate)) continue
    result.add(candidate)
  }

  return result
}

function clonePattern(pattern) {
  return {
    ...pattern,
    morningPeak: pattern.morningPeak + randomRange(-0.4, 0.4),
    dayPeak: pattern.dayPeak + randomRange(-0.5, 0.5),
    eveningPeak: pattern.eveningPeak + randomRange(-0.5, 0.5),
    morningWeight: pattern.morningWeight * randomRange(0.9, 1.1),
    dayWeight: pattern.dayWeight * randomRange(0.9, 1.1),
    eveningWeight: pattern.eveningWeight * randomRange(0.9, 1.1),
  }
}

function getStartTime(startArg, days, slotMinutes) {
  if (startArg) {
    const parsed = new Date(startArg)
    if (isNaN(parsed.getTime())) {
      throw new Error(`Invalid start date provided: ${startArg}`)
    }
    return alignToSlot(parsed, slotMinutes)
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(today)
  start.setDate(start.getDate() - (days - 1))
  return alignToSlot(start, slotMinutes)
}

function alignToSlot(date, slotMinutes) {
  const aligned = new Date(date)
  aligned.setSeconds(0, 0)
  const minutes = aligned.getMinutes()
  aligned.setMinutes(minutes - (minutes % slotMinutes))
  return aligned
}

function buildConfig(args) {
  return {
    days: Math.max(1, parseIntArg(args.days, DEFAULTS.days)),
    slotMinutes: Math.max(1, parseIntArg(args['slot-minutes'], DEFAULTS.slotMinutes)),
    maxVisitorsPerSlot: Math.max(1, parseIntArg(args['max-visitors'], DEFAULTS.maxVisitorsPerSlot)),
    globalTrafficMultiplier: parseFloatArg(args['global-traffic'], DEFAULTS.globalTrafficMultiplier),
    busyFactor: parseFloatArg(args['busy-factor'], DEFAULTS.busyFactor),
    calmFactor: parseFloatArg(args['calm-factor'], DEFAULTS.calmFactor),
    output: typeof args.output === 'string' ? args.output : DEFAULTS.output,
    seed: args.seed !== undefined ? parseIntArg(args.seed, Date.now()) : Date.now(),
  }
}

function parseArgs(argv) {
  const parsed = {}
  for (let i = 0; i < argv.length; i++) {
    const part = argv[i]
    if (!part.startsWith('--')) continue
    const [rawKey, rawValue] = part.slice(2).split('=')
    const key = rawKey
    if (rawValue !== undefined) {
      parsed[key] = rawValue
    } else if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) {
      parsed[key] = argv[i + 1]
      i++
    } else {
      parsed[key] = true
    }
  }
  return parsed
}

function parseIntArg(value, fallback) {
  const num = Number(value)
  return Number.isFinite(num) ? Math.trunc(num) : fallback
}

function parseFloatArg(value, fallback) {
  const num = Number(value)
  return Number.isFinite(num) ? num : fallback
}

function createRng(seedValue = Date.now()) {
  let seed = seedValue >>> 0
  if (!seed) seed = 1
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function randomRange(min, max) {
  return min + (max - min) * rng()
}

function randomInt(min, max) {
  return Math.floor(randomRange(min, max + 1))
}

function randomNormal(mean, stdDev) {
  let u = 0
  let v = 0
  while (u === 0) u = rng()
  while (v === 0) v = rng()
  const mag = Math.sqrt(-2.0 * Math.log(u))
  const z = mag * Math.cos(2.0 * Math.PI * v)
  return mean + z * stdDev
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function escapeSqlString(value = '') {
  return String(value).replace(/'/g, "''")
}

function formatNullableNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Number(value).toFixed(6)
  }
  return 'NULL'
}

function formatDateTime(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

function isWeekend(date) {
  const day = date.getDay()
  return day === 0 || day === 6
}
