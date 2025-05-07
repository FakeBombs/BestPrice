// --- Import all language files ---
import afTranslations from './af';
import amTranslations from './am';
import arTranslations from './ar';
import asTranslations from './as';
import azTranslations from './az';
import beTranslations from './be';
import berTranslations from './ber'; // Assuming Tamazight/Berber base code
import bgTranslations from './bg';
import bnTranslations from './bn';
import brTranslations from './br';
import bsTranslations from './bs';
import caTranslations from './ca';
import cebTranslations from './ceb';
import ckbTranslations from './ckb'; // Kurdish (Sorani)
import coTranslations from './co';
import csTranslations from './cs';
import cyTranslations from './cy';
import daTranslations from './da';
import deTranslations from './de';
import elTranslations from './el';
import enTranslations from './en';
import esTranslations from './es';
import etTranslations from './et';
import euTranslations from './eu';
import faTranslations from './fa';
import ffTranslations from './ff';
import fiTranslations from './fi';
import filTranslations from './fil';
import foTranslations from './fo';
import frTranslations from './fr';
import furTranslations from './fur';
import fyTranslations from './fy';
import gaTranslations from './ga';
import glTranslations from './gl';
import gnTranslations from './gn';
import guTranslations from './gu';
import haTranslations from './ha';
import heTranslations from './he';
import hiTranslations from './hi';
import hrTranslations from './hr';
import htTranslations from './ht';
import huTranslations from './hu';
import hyTranslations from './hy';
import idTranslations from './id';
import ikTranslations from './ik'; // Inupiaq
import isTranslations from './is';
import itTranslations from './it';
import iuTranslations from './iu'; // Inuktitut
import jaTranslations from './ja';
import jvTranslations from './jv';
import kaTranslations from './ka';
import kkTranslations from './kk';
import kmTranslations from './km';
import knTranslations from './kn';
import koTranslations from './ko';
import kuTranslations from './ku'; // Kurdish (Kurmanji)
import kyTranslations from './ky';
import loTranslations from './lo';
import ltTranslations from './lt';
import lvTranslations from './lv';
import mgTranslations from './mg';
import mkTranslations from './mk';
import mlTranslations from './ml';
import mnTranslations from './mn';
import mrTranslations from './mr';
import msTranslations from './ms';
import mtTranslations from './mt';
import myTranslations from './my';
import nbTranslations from './nb'; // Norwegian Bokmål
import neTranslations from './ne';
// Note: Assuming 'nl' covers both nl and nl-BE (Flemish)
import nlTranslations from './nl'; // You would need to create nl.ts
import nnTranslations from './nn'; // Norwegian Nynorsk
import orTranslations from './or';
import paTranslations from './pa';
import plTranslations from './pl';
import psTranslations from './ps';
// Note: Assuming 'pt' covers both pt-BR and pt-PT
import ptTranslations from './pt'; // You would need to create pt.ts
import roTranslations from './ro';
import ruTranslations from './ru';
import rwTranslations from './rw';
import scTranslations from './sc';
import siTranslations from './si';
import skTranslations from './sk';
import slTranslations from './sl';
import snTranslations from './sn';
import soTranslations from './so';
import sqTranslations from './sq';
import srTranslations from './sr';
import svTranslations from './sv';
import swTranslations from './sw';
import syrTranslations from './syr'; // Syriac
import szlTranslations from './szl'; // Silesian
import taTranslations from './ta';
import teTranslations from './te';
import tgTranslations from './tg';
import thTranslations from './th';
import trTranslations from './tr';
import ttTranslations from './tt';
import ukTranslations from './uk';
import urTranslations from './ur';
import uzTranslations from './uz';
import viTranslations from './vi';
// Note: Assuming 'zh' covers zh-CN, zh-TW, zh-HK etc.
import zhTranslations from './zh';
import zzaTranslations from './zza'; // Zaza

// --- Define the structure for a single language ---
// Uses 'en' as the baseline assuming it contains all keys required by the application.
// If another language is more complete, use that one instead (e.g., typeof elTranslations).
export type LanguageStrings = typeof enTranslations;

// --- Define the structure for ALL translations ---
// Maps the language code (used in filenames and context) to the LanguageStrings type.
export type AllTranslations = {
  af: LanguageStrings;
  am: LanguageStrings;
  ar: LanguageStrings;
  as: LanguageStrings;
  az: LanguageStrings;
  be: LanguageStrings;
  ber: LanguageStrings;
  bg: LanguageStrings;
  bn: LanguageStrings;
  br: LanguageStrings;
  bs: LanguageStrings;
  ca: LanguageStrings;
  ceb: LanguageStrings;
  ckb: LanguageStrings;
  co: LanguageStrings;
  cs: LanguageStrings;
  cy: LanguageStrings;
  da: LanguageStrings;
  de: LanguageStrings;
  el: LanguageStrings;
  en: LanguageStrings;
  es: LanguageStrings;
  et: LanguageStrings;
  eu: LanguageStrings;
  fa: LanguageStrings;
  ff: LanguageStrings;
  fi: LanguageStrings;
  fil: LanguageStrings;
  fo: LanguageStrings;
  fr: LanguageStrings;
  fur: LanguageStrings;
  fy: LanguageStrings;
  ga: LanguageStrings;
  gl: LanguageStrings;
  gn: LanguageStrings;
  gu: LanguageStrings;
  ha: LanguageStrings;
  he: LanguageStrings;
  hi: LanguageStrings;
  hr: LanguageStrings;
  ht: LanguageStrings;
  hu: LanguageStrings;
  hy: LanguageStrings;
  id: LanguageStrings;
  ik: LanguageStrings;
  is: LanguageStrings;
  it: LanguageStrings;
  iu: LanguageStrings;
  ja: LanguageStrings;
  jv: LanguageStrings;
  ka: LanguageStrings;
  kk: LanguageStrings;
  km: LanguageStrings;
  kn: LanguageStrings;
  ko: LanguageStrings;
  ku: LanguageStrings;
  ky: LanguageStrings;
  lo: LanguageStrings;
  lt: LanguageStrings;
  lv: LanguageStrings;
  mg: LanguageStrings;
  mk: LanguageStrings;
  ml: LanguageStrings;
  mn: LanguageStrings;
  mr: LanguageStrings;
  ms: LanguageStrings;
  mt: LanguageStrings;
  my: LanguageStrings;
  nb: LanguageStrings;
  ne: LanguageStrings;
  nl: LanguageStrings;
  nn: LanguageStrings;
  or: LanguageStrings;
  pa: LanguageStrings;
  pl: LanguageStrings;
  ps: LanguageStrings;
  pt: LanguageStrings;
  ro: LanguageStrings;
  ru: LanguageStrings;
  rw: LanguageStrings;
  sc: LanguageStrings;
  si: LanguageStrings;
  sk: LanguageStrings;
  sl: LanguageStrings;
  sn: LanguageStrings;
  so: LanguageStrings;
  sq: LanguageStrings;
  sr: LanguageStrings;
  sv: LanguageStrings;
  sw: LanguageStrings;
  syr: LanguageStrings;
  szl: LanguageStrings;
  ta: LanguageStrings;
  te: LanguageStrings;
  tg: LanguageStrings;
  th: LanguageStrings;
  tr: LanguageStrings;
  tt: LanguageStrings;
  uk: LanguageStrings;
  ur: LanguageStrings;
  uz: LanguageStrings;
  vi: LanguageStrings;
  zh: LanguageStrings;
  zza: LanguageStrings;
};

const initialDefaultTranslations: AllTranslations = {
  af: afTranslations,
  am: amTranslations,
  ar: arTranslations,
  as: asTranslations,
  az: azTranslations,
  be: beTranslations,
  ber: berTranslations,
  bg: bgTranslations,
  bn: bnTranslations,
  br: brTranslations,
  bs: bsTranslations,
  ca: caTranslations,
  ceb: cebTranslations,
  ckb: ckbTranslations,
  co: coTranslations,
  cs: csTranslations,
  cy: cyTranslations,
  da: daTranslations,
  de: deTranslations,
  el: elTranslations,
  en: enTranslations,
  es: esTranslations,
  et: etTranslations,
  eu: euTranslations,
  fa: faTranslations,
  ff: ffTranslations,
  fi: fiTranslations,
  fil: filTranslations,
  fo: foTranslations,
  fr: frTranslations,
  fur: furTranslations,
  fy: fyTranslations,
  ga: gaTranslations,
  gl: glTranslations,
  gn: gnTranslations,
  gu: guTranslations,
  ha: haTranslations,
  he: heTranslations,
  hi: hiTranslations,
  hr: hrTranslations,
  ht: htTranslations,
  hu: huTranslations,
  hy: hyTranslations,
  id: idTranslations,
  ik: ikTranslations,
  is: isTranslations,
  it: itTranslations,
  iu: iuTranslations,
  ja: jaTranslations,
  jv: jvTranslations,
  ka: kaTranslations,
  kk: kkTranslations,
  km: kmTranslations,
  kn: knTranslations,
  ko: koTranslations,
  ku: kuTranslations,
  ky: kyTranslations,
  lo: loTranslations,
  lt: ltTranslations,
  lv: lvTranslations,
  mg: mgTranslations,
  mk: mkTranslations,
  ml: mlTranslations,
  mn: mnTranslations,
  mr: mrTranslations,
  ms: msTranslations,
  mt: mtTranslations,
  my: myTranslations,
  nb: nbTranslations,
  ne: neTranslations,
  nl: nlTranslations,
  nn: nnTranslations,
  or: orTranslations,
  pa: paTranslations,
  pl: plTranslations,
  ps: psTranslations,
  pt: ptTranslations,
  ro: roTranslations,
  ru: ruTranslations,
  rw: rwTranslations,
  sc: scTranslations,
  si: siTranslations,
  sk: skTranslations,
  sl: slTranslations,
  sn: snTranslations,
  so: soTranslations,
  sq: sqTranslations,
  sr: srTranslations,
  sv: svTranslations,
  sw: swTranslations,
  syr: syrTranslations,
  szl: szlTranslations,
  ta: taTranslations,
  te: teTranslations,
  tg: tgTranslations,
  th: thTranslations,
  tr: trTranslations,
  tt: ttTranslations,
  uk: ukTranslations,
  ur: urTranslations,
  uz: uzTranslations,
  vi: viTranslations,
  zh: zhTranslations,
  zza: zzaTranslations,
};

export default initialDefaultTranslations;
