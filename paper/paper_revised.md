---
title: 'TraitHorizon: Scalable Exploration of Large Image-Feature Paired Datasets'
tags:
    - biomedical imaging
    - visualization
    - quality control
authors:
- name: Jackson Jacobs
  orcid: 0009-0002-7386-6596
  equal-contrib: true
  affiliation: "1"
- name: Fan Fan
  orcid: 0009-0006-8897-5348
  equal-contrib: true
  affiliation: "1"
- name: Laura Barisoni
  orcid: 0000-0003-0848-9683
  affiliation: "2, 3"
- name: Andrew Janowczyk
  orcid: 0000-0003-2982-4321
  corresponding: true
  affiliation: "1, 4, 5"
affiliations:
- name: Department of Biomedical Engineering, Emory University and Georgia Institute of Technology, Atlanta, Georgia, USA
  index: 1
- name: Department of Pathology, Division of AI and Computational Pathology, Duke University, Durham, North Carolina, USA
  index: 2
- name: Department of Medicine, Division of Nephrology, Duke University, Durham, North Carolina, USA
  index: 3
- name: Division of Precision Oncology, Department of Oncology, University Hospital of Geneva, Geneva, Switzerland
  index: 4
- name: Division of Clinical Pathology, Department of Diagnostics, University Hospital of Geneva, Geneva, Switzerland
  index: 5
date: 11 November 2025
bibliography: paper.bib
---

# Summary

Collections of Objects of Interest (OOIs)—such as cells, tubules, or tissue patches—paired with high-dimensional, computationally derived feature vectors are increasingly generated in image-based biomedical research. These OOI-feature datasets are routinely explored to detect outliers for quality control, uncover patterns, and generate biological insights. However, as datasets grow in size and complexity, researchers face bottlenecks: repeated manual creation of static visualizations for each subpopulation, difficulties efficiently plotting large numbers of high-dimensional feature vectors, and limited tooling for tracing individual feature values back to their source objects.

TraitHorizon is a browser-based visualization platform for interactive exploration of large OOI–feature pair datasets. It integrates three synchronized visualization components: (a) a parallel coordinates plot for feature-vector–level exploration, (b) dynamic violin plots for per-feature distribution analysis, and (c) a tabular data grid linking each feature vector to its corresponding object image. Its interactive interface enables real-time, scalable visualization of datasets containing hundreds of thousands of OOI-feature pairs. We demonstrate TraitHorizon's utility through a quality control case study involving 260,201 segmented kidney tubules, each characterized by 99 features, illustrating how the platform facilitates rapid, interpretable, and reproducible data interrogation.

TraitHorizon is publicly available at [https://traithorizon.com/](https://traithorizon.com/).

# Statement of need

Research in computational imaging fields often aims to discover trends in OOIs associated with diagnosis, prognosis, and therapy response [@1; @2; @3]. From these objects, numerical feature vectors are extracted to encode their attributes, ranging from simple measures (e.g., area, texture) to deep learning-derived descriptors [@4; @5]. These features are examined using static visualizations such as parallel coordinates plots [@6] or dimensionality reduction scatter plots [@7; @8], aided by summary statistics, to uncover structure and outliers. Multiple subpopulations often emerge, prompting repeated visualization and metric generation.

This workflow remains time-intensive due to three limiting factors. First, there is a **lack of connection** between an object's image, feature values, and cohort-level visualization. Discovering outliers or clusters prompts the need to trace them back to images, but static plots force analysts to manually map plotted points to objects. Second, **exploring subpopulations incurs high time cost**: manually plotting each subpopulation is inefficient, while programmatic approaches require subpopulations to be defined *a priori*. Dynamic filtering and responsive plots are needed for iterative exploration. Third, **rendering latency disrupts analysis** when datasets reach hundreds of thousands of data points. Browser-based tools not designed for this scale suffer from heavy memory utilization, latency, and unresponsiveness.

These factors motivate the development of interactive visualization tools that dynamically generate visualizations during exploration, seamlessly link plotted data to source images, and efficiently render at scale.

# State of the field

Several existing tools address parts of the interactive visualization problem but none fully satisfy all three requirements simultaneously. TensorBoard Projector [@9] and HoloViews [@10] support interactive plotting of large multivariate datasets but do not provide integrated image viewing linked to data points. DendroMap [@11] facilitates qualitative exploration of large image collections but does not link images back to their feature vectors or support dynamic filtering by feature value. HistoQC [@12] provides image-linked plots and quality metrics but is tailored specifically to whole-slide-level quality control in digital pathology, supporting only its predefined feature set rather than arbitrary user-defined feature vectors or object-level images.

TraitHorizon was built as a standalone tool rather than contributing to these existing projects for several reasons. First, no existing tool couples image display with high-dimensional feature visualization and interactive filtering in a single interface. Second, TraitHorizon's input format—a simple TSV file paired with an image directory—is deliberately generic, making it compatible with any upstream tool that outputs tabular data (e.g., HistoQC [@12], CohortFinder [@18]). Third, TraitHorizon's rendering pipeline was designed from the ground up for browser-based scalability to hundreds of thousands of objects, a requirement not addressed by the tools above.

# Software design

TraitHorizon is a Flask-based web application [@13], making it suitable for collaborative environments when hosted over a network. The front end leverages SlickGrid [@14], Parallel Coordinates (parcoords [@15]), and D3.js [@16] to power the interactive dashboard. Its command-line interface ingests a directory of object images (any browser-supported format [@17]) and a TSV file where each row contains an image filename followed by tab-separated feature columns. Integer, float, scientific notation, and categorical features are supported, along with an optional clickable URL column.

Key architectural decisions target scalability to datasets with hundreds of thousands of objects. (1) **Non-blocking progressive rendering** of the parallel coordinates plot keeps the interface responsive during rendering, completing in seconds to minutes depending on dataset size. (2) **Exportable filter configurations** allow parallel coordinate brush settings and filtered object IDs to be saved and restored via a lean JSON format without re-rendering. (3) **Infinite scrolling** in the data grid dynamically loads and replaces content within a fixed memory footprint. (4) **On-demand image loading** limits browser memory and network utilization. (5) **On-demand violin plot computation** avoids unnecessary CPU usage by computing distribution plots only when a user hovers over a parallel axis.

These design choices enable TraitHorizon to operate smoothly within browser constraints on consumer-grade hardware, regardless of dataset size.

# Use case

We demonstrate TraitHorizon using data from a digital pathology biomarker study [@2; @19]. The dataset comprises 260,201 segmented tubules and 99 associated pathomic features computed from 254 PAS-stained kidney biopsies from the NEPTUNE [@21; @22] and CureGN [@23] consortia.

![TraitHorizon web application interface. (A) The parallel coordinates plot displays 99 features from 260,201 tubules. (B) Violin plot of a selected feature on hover. (C) Data grid with segmented tubular images and associated features. (D) Status bar showing visible instance count. (E) Drop zone and export button for filter configurations.\label{fig:1}](figures/Picture1.png)

After launching TraitHorizon (\autoref{fig:1}), we explored the parallel coordinates plot for a global view of feature distributions. Hovering over `TBM_THICK_MAX` (maximum tubular basement membrane thickness) revealed a strongly skewed distribution via the violin plot, suggesting extremal-value tubules requiring closer examination.

![Interactive filtering isolating tubules with high `TBM_THICK_MAX` values (30–40). The 119 matching instances are highlighted in red; all others are greyed out.\label{fig:2}](figures/Picture2.png)

We filtered tubules with high `TBM_THICK_MAX` by brushing the corresponding axis (\autoref{fig:2}). The data grid revealed consistently thickened basement membranes (large green segments), a hallmark of tubular atrophy [@20; @24]. Hovering over individual rows highlighted their feature vectors in the parallel coordinates plot (\autoref{fig:3}), revealing a subpopulation exhibiting both thickened basement membranes and enlarged lumina. Applying a second brush on `LUMEN_THICK_MAX` (\autoref{fig:4}) isolated this composite phenotype, which pathologists confirmed as a distinct morphological pattern [@20].

![Hovering over an instance in the data grid highlights its feature vector in blue across the parallel coordinates plot, enabling multi-feature pattern identification.\label{fig:3}](figures/Picture3.png)

![Joint filtering across `TBM_THICK_MAX` and `LUMEN_THICK_MAX`. Filter configurations can be exported (3) and reimported (4) as JSON for reproducibility.\label{fig:4}](figures/Picture4.png)

TraitHorizon also supports exact-value search (\autoref{fig:6}), sorting features within the data grid (\autoref{fig:7}), and linking objects to external viewers via URL columns (\autoref{fig:5}). In our workflow, clicking a URL opened the corresponding tubule in HistomicsUI [@27] within the Digital Slide Archive [@28], enabling pathologists to assess the broader tissue microenvironment.

![External URL integration linking a tubule to HistomicsUI for contextual visualization.\label{fig:5}](figures/Picture5.png)

![Searching by exact value using a "Needs QC" indicator to isolate flagged tubules.\label{fig:6}](figures/Picture6.png)

![Sorting by `TBM_AREA` reveals a morphological gradient from thin to thickened basement membranes.\label{fig:7}](figures/Picture7.png)

# Research impact statement

TraitHorizon has been directly used in two published studies investigating tubular pathomics in kidney disease. Fan et al. [@2] used TraitHorizon to perform quality control and exploratory analysis of 260,201 segmented tubules and 99 pathomic features, uncovering morphological patterns along a trajectory from normal to atrophic tubules that were subsequently validated by study pathologists and found to be clinically relevant. Ambekar et al. [@5] similarly used TraitHorizon for quality control of glomerular pathomic features in a study of minimal change disease and focal segmental glomerulosclerosis. In both studies, TraitHorizon enabled rapid identification of segmentation artifacts and biologically meaningful subpopulations that would have been impractical to discover using static visualization methods.

TraitHorizon is available as a Python package on PyPI and as a Docker image, providing straightforward installation across computing environments. Its simple TSV-plus-images input format is compatible with any upstream computational pipeline producing tabular features, and has already been used alongside HistoQC [@12] and CohortFinder [@18]. The tool is designed for broad applicability across computational imaging fields wherever researchers need to explore large collections of objects paired with high-dimensional feature vectors.

# AI usage disclosure

No generative AI tools were used in the development of the TraitHorizon software, its documentation, or the original manuscript. Claude Opus 4 (Anthropic), accessed via GitHub Copilot in VS Code, was used solely to assist with restructuring and condensing the manuscript to meet the updated JOSS format and word limit requirements. All AI-generated text was reviewed, edited, and validated by the human authors, who made all decisions regarding scientific content and framing.

# Acknowledgements

# References
