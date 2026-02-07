const fs = require('fs');
const path = require('path');

const desktopPath = '/Users/davudzulumkhanov/Desktop';
const outputFile = path.join(desktopPath, 'FINAL_Synthetic_Theory_Money_QJAE.txt');

// Читаем все файлы
const originalPaper = fs.readFileSync(path.join(desktopPath, 'Synthetic_Theory_of_Money_Full_Paper.txt'), 'utf-8');
const expandedSectionC = fs.readFileSync(path.join(desktopPath, 'Expanded_Section_III_C_Market_Tokens.txt'), 'utf-8');
const europeanEtymology = fs.readFileSync(path.join(desktopPath, 'European_Etymology_Money_Terms.txt'), 'utf-8');

// Разделяем оригинал на секции
const sections = originalPaper.split(/={80,}/);

// Находим Section III
const section3Start = originalPaper.indexOf('III. THE THREE PRE-MONETARY FUNCTIONS');
const section4Start = originalPaper.indexOf('IV. THE CONVERGENCE');

// Извлекаем Section III без старого C-подраздела
let section3Text = originalPaper.substring(section3Start, section4Start);

// Находим где начинается C. Market Rental Tokens в оригинале
const oldCStart = section3Text.indexOf('C. Market Rental Tokens (Commercial Function)');
const section3BeforeC = section3Text.substring(0, oldCStart);

// Извлекаем расширенный C из файла расширений
const expandedCStart = expandedSectionC.indexOf('C. Market Rental Tokens (Commercial Function)');
const expandedCEnd = expandedSectionC.indexOf('ДОПОЛНЕНИЕ К РАЗДЕЛУ IV');
const newCSection = expandedSectionC.substring(expandedCStart, expandedCEnd > 0 ? expandedCEnd : expandedSectionC.length);

// Извлекаем европейскую этимологию как отдельный подраздел
const etymologyContent = europeanEtymology.substring(
  europeanEtymology.indexOf('EUROPEAN ETYMOLOGICAL EVIDENCE'),
  europeanEtymology.indexOf('================================================================================\nREFERENCES TO ADD')
);

// Собираем новый Section III
const newSection3 = section3BeforeC + '\n' + newCSection + '\n\n' +
  '================================================================================\n' +
  'D. European Etymological Evidence\n' +
  '================================================================================\n\n' +
  etymologyContent;

// Собираем весь документ
let finalPaper = originalPaper.substring(0, section3Start) +
  newSection3 +
  originalPaper.substring(section4Start);

// Обновляем References - добавляем новые источники
const refsStart = finalPaper.indexOf('================================================================================\nREFERENCES\n');
const refsEnd = finalPaper.indexOf('================================================================================\nAUTHOR CONTACT INFORMATION');

let currentRefs = finalPaper.substring(refsStart, refsEnd);

// Новые источники из расширений
const newRefs = `
Allsen, Thomas T. 1997. "Ever Closer Encounters: The Appropriation of Culture and the Apportionment of Peoples in the Mongol Empire." Journal of Early Modern History 1(1): 2-23.

Atwood, Christopher P. 2004. Encyclopedia of Mongolia and the Mongol Empire. New York: Facts on File.

Buck, Carl Darling. 1949. A Dictionary of Selected Synonyms in the Principal Indo-European Languages. Chicago: University of Chicago Press.

Burke, Aaron Alexander. 2008. "Walled Up to Heaven": The Evolution of Middle Bronze Age Fortification Strategies in the Levant. Winona Lake, IN: Eisenbrauns.

Drompp, Michael R. 2005. "Breaking the Orkhon Tradition: Kirghiz Adherence to the Yenisei Region after A.D. 840." Journal of the American Oriental Society 125(3): 397-417.

Grierson, Philip. 1959. "Commerce in the Dark Ages: A Critique of the Evidence." Transactions of the Royal Historical Society 9: 123-140.

Grierson, Philip. 1977. The Origins of Money. London: Athlone Press.

Kenoyer, Jonathan Mark. 1998. Ancient Cities of the Indus Valley Civilization. Oxford: Oxford University Press.

Kluge, Friedrich. 2002. Etymologisches Wörterbuch der deutschen Sprache. 24th ed. Berlin: Walter de Gruyter.

Mallory, J. P., and Douglas Q. Adams. 1997. Encyclopedia of Indo-European Culture. London: Fitzroy Dearborn.

Morgan, David. 2007. The Mongols. 2nd ed. Oxford: Blackwell Publishing.

Mumford, Lewis. 1961. The City in History: Its Origins, Its Transformations, and Its Prospects. New York: Harcourt, Brace & World.

Noonan, Thomas S. 1980. "The Beginning of Coinage in the Baltic Region, ca. 800-1000." In Les Pays du Nord et Byzance, edited by Rudolf Zeitler, 475-502. Uppsala: Almqvist & Wiksell.

Richardson, Seth. 2016. "Before Things Worked: A 'Low-Power' Model of Early Mesopotamia." In Theories of Urbanism: Lessons from the Mesopotamian City, edited by Stephanie R. Pincus, David S. Mixter, and Seth Richardson, 119-156. Boulder, CO: University Press of Colorado.

Rossabi, Morris. 2014. "The Mongols and Their Legacy." In The Cambridge History of China, Vol. 6: Alien Regimes and Border States, 907-1368, edited by Herbert Franke and Denis Twitchett, 321-413. Cambridge: Cambridge University Press.

Spufford, Peter. 1988. Money and Its Use in Medieval Europe. Cambridge: Cambridge University Press.

Wilkinson, Tony J. 2003. Archaeological Landscapes of the Near East. Tucson: University of Arizona Press.
`;

// Вставляем новые источники перед существующими
currentRefs = currentRefs.replace(
  'Graeber, David.',
  newRefs + '\nGraeber, David.'
);

finalPaper = finalPaper.substring(0, refsStart) + currentRefs + finalPaper.substring(refsEnd);

// Обновляем аннотацию
finalPaper = finalPaper.replace(
  'The theory maintains core Austrian insights regarding spontaneous order, entrepreneurial discovery, and private origin while providing historical and institutional depth that complements and extends Mengerian analysis.',
  'The theory maintains core Austrian insights regarding spontaneous order, entrepreneurial discovery, and private origin while providing historical and institutional depth that complements and extends Mengerian analysis. Archaeological evidence from Mongol paiza systems, early urban fortifications, and European etymological patterns provides empirical support for the gift-sovereignty-token synthesis.'
);

// Обновляем ключевые слова
finalPaper = finalPaper.replace(
  'Keywords: Austrian economics, money origins, institutional evolution, Menger, coins, banking history',
  'Keywords: Austrian economics, money origins, institutional evolution, Menger, coins, banking history, gift exchange, territorial sovereignty, passage tokens'
);

// Сохраняем финальный файл
fs.writeFileSync(outputFile, finalPaper, 'utf-8');

console.log('✅ Финальная статья создана: ' + outputFile);
console.log('📊 Размер: ' + Math.round(finalPaper.length / 1000) + 'KB');
console.log('📄 Слов (приблизительно): ' + Math.round(finalPaper.split(/\s+/).length));
console.log('\n📝 Добавлено:');
console.log('  - Расширенный раздел III.C (дарообмен, пайцза, городские стены)');
console.log('  - Новый раздел III.D (европейская этимология)');
console.log('  - 17 новых источников в References');
console.log('  - Обновлены Abstract и Keywords');
