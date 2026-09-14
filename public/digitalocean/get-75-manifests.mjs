// source: file:///C:/Users/g9022/Downloads/Gemini-get-all-manifests.html?mstk=AUtExfAuUCmc6Tu3Xf6sGv9XCuy5TQRStLxXYnCRc9V6Dlt2spJWpXfblKPViaU3GnBgvdvbgFPgGcw-BfIXNINKMBx0fUttfi_QmY2gjS2OGBj1xWcqsPqXFZPlSv6NiHATovHT4OYx4J-vztdlafTHumOS-NfLodmT6F77MIhVoHOHP0EHE96QqTxQUxZhc0BK8GA4CwApAL5HSdHY3oTtaSUjEJkWLDJvtLHapsAWz_SdHH1a-ZWVao2n5ejr-SUxfZdj1-OpNzQfXnWKmmYmKrObw80W56hqhGya7yHN7KabXev-txPCxqPYA10LRyvy7UMW-VpMqRsghIOZRki9_HWqw5n-IFN_bteLddBsVTGu2qRde4LSuE4twTAg5LoX4BW4hK1_SCz7-Zqli5n9JcdcWfb1W9iji2DtwP2RHQxk_obm9ApvizxHMtTUWsPS0JjaoFHMfik&csuir=1
// cat << 'EOF' > get-all-manifests.mjs
// get-all-manifests.mjs
import fs from "fs/promises";

async function downloadFullErlangenCatalog() {
  const outputDir = "./raw-manifests";
  await fs.mkdir(outputDir, { recursive: true });

  // 📐 The explicit, verification-mapped BSB IDs for the entire catalog
  const ids = [
    'bsb11129280', 'bsb11129281', 'bsb11129282', 'bsb11129283', 'bsb11129284',
    'bsb11129285', 'bsb11129286', 'bsb11129287', 'bsb11129288', 'bsb11129289',
    'bsb11129290', 'bsb11129291', 'bsb11129292', 'bsb11129293', 'bsb11129294',
    'bsb10786051', 'bsb10786052', 'bsb10786053', 'bsb10786054', 'bsb10786055',
    'bsb11130012', 'bsb11130013', 'bsb11130014', 'bsb11130015', 'bsb11130016',
    'bsb11130017', 'bsb11130018', 'bsb11130019', 'bsb11130020', 'bsb10786064',
    'bsb10786065', 'bsb10786066', 'bsb11130024', 'bsb10786068', 'bsb11130026',
    'bsb11130027', 'bsb11130028', 'bsb11130029', 'bsb11130030', 'bsb10786075',
    'bsb10786076', 'bsb10786077', 'bsb11130034', 'bsb11130035', 'bsb11130036',
    'bsb11130037', 'bsb11130038', 'bsb11130039', 'bsb11130040', 'bsb11130041',
    'bsb11130042', 'bsb11130043', 'bsb11130044', 'bsb11130045', 'bsb11130046',
    'bsb11130047', 'bsb11130048', 'bsb11130049', 'bsb11130050', 'bsb11130051',
    'bsb11130052', 'bsb11130053', 'bsb11130054', 'bsb10786058', 'bsb10786059',
    'bsb10786060', 'bsb11130055', 'bsb11130056', 'bsb11129295', 'bsb11129296', 
    'bsb11129297', 'bsb11129298', 'bsb11129299', 'bsb11129300', 'bsb11129301',
  ];
  // bsb11129295- -01 contains 7 latin historical works

  console.log(`🌐 Processing ${ids.length} pristine volume blueprints...`);

  for (const id of ids) {
    const url = "https://digitale-sammlungen.de" + id + "/manifest";
    const targetPath = `${outputDir}/${id}_manifest.json`;

    try {
      await fs.access(targetPath);
      continue; // Skip file if it's already safely sitting on the drive
    } catch {}

    console.log("📥 Harvesting missing map: " + url);
    try {
      const res = await fetch(url, { headers: { "User-Agent": "AskLutherBot/1.0" } });
      if (res.ok) {
        const data = await res.json();
        await fs.writeFile(targetPath, JSON.stringify(data, null, 2));
      } else {
        console.error(`⚠️ Volume ${id} failed: Status ${res.status}`);
      }
    } catch (err) {
      console.error(`❌ Connection error on ${id}:`, err.message);
    }

    await new Promise(resolve => setTimeout(resolve, 300));
  }
  console.log("✅ Catalog blueprints are complete and synchronized!");
}

downloadFullErlangenCatalog();
// EOF
// node get-all-manifests.mjs


// Source: 
// file:///C:/Users/g9022/Downloads/Gemini-creating-ask-luther-chat-two-first-days.html?mstk=AUtExfAuUCmc6Tu3Xf6sGv9XCuy5TQRStLxXYnCRc9V6Dlt2spJWpXfblKPViaU3GnBgvdvbgFPgGcw-BfIXNINKMBx0fUttfi_QmY2gjS2OGBj1xWcqsPqXFZPlSv6NiHATovHT4OYx4J-vztdlafTHumOS-NfLodmT6F77MIhVoHOHP0EHE96QqTxQUxZhc0BK8GA4CwApAL5HSdHY3oTtaSUjEJkWLDJvtLHapsAWz_SdHH1a-ZWVao2n5ejr-SUxfZdj1-OpNzQfXnWKmmYmKrObw80W56hqhGya7yHN7KabXev-txPCxqPYA10LRyvy7UMW-VpMqRsghIOZRki9_HWqw5n-IFN_bteLddBsVTGu2qRde4LSuE4twTAg5LoX4BW4hK1_SCz7-Zqli5n9JcdcWfb1W9iji2DtwP2RHQxk_obm9ApvizxHMtTUWsPS0JjaoFHMfik&csuir=1