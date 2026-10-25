# Initial audit capture — superseded before the first commit

The first browser extraction was taken before all off-screen entrance reveals had run. The temporary content renderer matched it, but screenshot inspection exposed missing visible headings and whole sections. The passing result was therefore insufficient.

The original snapshot and hash are preserved here unchanged. A second read-only live audit visited every heading, waited for visibility and rejected hidden main headings. Authored text arrays were checked against the first extraction and were identical. Only observed visibility/completeness and additional source attributes changed. No site copy was rewritten and no allowed content differences were added. The corrected canonical snapshot is content/legacy-snapshot.json. Do not use this archived incomplete snapshot for verification.
