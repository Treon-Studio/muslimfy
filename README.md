<div align="center"><a name="readme-top"></a>
 />

<a href="https://github.com/Treon-Studio/muslimfy">
  <img src="https://github.com/user-attachments/assets/d0f8b63b-6f48-4318-a584-5c145a04d003" width="120" alt="Muslimfy Banner">
</a>

# Muslimfy

Muslimfy is an open-source multi-platform application that combines technology with Islamic values to create a digital companion that helps Muslims navigate their spiritual and daily lives.

[Official Site][official-site] · [Changelog][changelog] · [Documents][docs] · [Blog][blog] · [Feedback][github-issues-link]

[![][share-x-shield]][share-x-link]
[![][share-telegram-shield]][share-telegram-link]
[![][share-whatsapp-shield]][share-whatsapp-link]
[![][share-reddit-shield]][share-reddit-link]
[![][share-linkedin-shield]][share-linkedin-link]

![][image-overview]

</div>

<details>
<summary><kbd>Table of contents</kbd></summary>

#### TOC

- [👋🏻 Getting Started & Join Our Community](#-getting-started--join-our-community)
- [✨ Features](#-features)
  - [`1` Chain of Thought](#1-chain-of-thought)
  - [`2` Branching Conversations](#2-branching-conversations)
  - [`3` Artifacts Support](#3-artifacts-support)
  - [`4` File Upload /Knowledge Base](#4-file-upload-knowledge-base)
  - [`5` Multi-Model Service Provider Support](#5-multi-model-service-provider-support)
  - [`*` What's more](#-whats-more)
- [⚡️ Performance](#️-performance)
- [🛳 Self Hosting](#-self-hosting)
  - [`A` Deploying with Vercel, Zeabur , Sealos or Alibaba Cloud](#a-deploying-with-vercel-zeabur--sealos-or-alibaba-cloud)
  - [`B` Deploying with Docker](#b-deploying-with-docker)
  - [Environment Variable](#environment-variable)
- [📦 Ecosystem](#-ecosystem)
- [🧩 Plugins](#-plugins)
- [⌨️ Local Development](#️-local-development)
- [🤝 Contributing](#-contributing)
- [❤️ Sponsor](#️-sponsor)
- [🔗 More Products](#-more-products)

####

<br/>

</details>

## ✨ Features

[![][image-feat-prayers]][docs-feat-prayers]

### `1` [Prayer Times][docs-feat-prayers]

Experience accurate and reliable prayer times personalized to your location. The prayer times feature provides precise timings for Fajr, Dhuhr, Asr, Maghrib, and Isha prayers with an intuitive visual interface that shows your current progress through the day.

Key capabilities include:
- Location-based prayer time calculation supporting global locations
- Smart notifications before prayer times with customizable reminders
- Visual prayer time tracking with progress indicators
- Support for various calculation methods including MUI, ISNA, and more
- Indonesian cities database with regional time zone adjustments

[![][back-to-top]](#readme-top)

[![][image-feat-tasbih]][docs-feat-tasbih]

### `2` [Tasbih Counter][docs-feat-tasbih]

A beautiful digital tasbih (prayer beads) counter for daily dhikr practice. Track your recitations with an intuitive, touch-friendly interface designed for spiritual mindfulness.

Key capabilities include:

- Multiple pre-configured dhikr options with Arabic text and translations
- Customizable count targets with cycle tracking
- Haptic feedback for physical engagement
- Beautiful, immersive UI with day/night theme adaptation
- Progress tracking with visual indicators

[![][back-to-top]](#readme-top)

[![][image-feat-verse]][docs-feat-verse]

### `3` [Verse of the Day][docs-feat-verse]

Receive daily inspiration from the Quran with a beautifully presented verse each day. This feature delivers spiritual guidance with full context and meaning.

Key capabilities include:

- Random verse selection from the entire Quran with Arabic text
- Complete translations and transliterations for better understanding
- Ability to bookmark favorite verses for future reference
- Integration with full Quran reader for extended study
- Elegant typography optimized for both Arabic and translated text

[![][back-to-top]](#readme-top)

[![][image-feat-tasks]][docs-feat-tasks]

### `4` [Task Manager][docs-feat-tasks]

Stay organized with an Islamic-themed task manager that helps you plan and track your daily activities. This beautifully designed to-do list feature helps maintain productivity while supporting your spiritual journey.

Key capabilities include:

- Intuitive task creation and management interface
- Progress tracking with visual completion indicators
- Task filtering for better focus (all, active, completed)
- Persistent storage that saves your tasks between sessions
- Responsive design that adapts to different screen sizes

<https://github.com/user-attachments/assets/faa8cf67-e743-4590-8bf6-ebf6ccc34175>

> \[!TIP]
>
> Learn more on [📘 RadasChat Knowledge Base Launch — From Now On, Every Step Counts](https://radas.raizora.com/blog/knowledge-base)

<div align="right">

[![][back-to-top]](#readme-top)

</div>

### `*` What's more

Beside these features, RadasChat also have much better basic technique underground:

- [x] 💨 **Quick Deployment**: Using the Vercel platform or docker image, you can deploy with just one click and complete the process within 1 minute without any complex configuration.
- [x] 🌐 **Custom Domain**: If users have their own domain, they can bind it to the platform for quick access to the dialogue agent from anywhere.
- [x] 🔒 **Privacy Protection**: All data is stored locally in the user's browser, ensuring user privacy.
- [x] 💎 **Exquisite UI Design**: With a carefully designed interface, it offers an elegant appearance and smooth interaction. It supports light and dark themes and is mobile-friendly. PWA support provides a more native-like experience.
- [x] 🗣️ **Smooth Conversation Experience**: Fluid responses ensure a smooth conversation experience. It fully supports Markdown rendering, including code highlighting, LaTex formulas, Mermaid flowcharts, and more.

> ✨ more features will be added when RadasChat evolve.

---

> \[!NOTE]
>
> You can find our upcoming [Roadmap][github-project-link] plans in the Projects section.

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## ⚡️ Performance

> \[!NOTE]
>
> The complete list of reports can be found in the [📘 Lighthouse Reports][docs-lighthouse]

|                   Desktop                   |                   Mobile                   |
| :-----------------------------------------: | :----------------------------------------: |
|              ![][chat-desktop]              |              ![][chat-mobile]              |
| [📑 Lighthouse Report][chat-desktop-report] | [📑 Lighthouse Report][chat-mobile-report] |

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🛳 Self Hosting

RadasChat provides Self-Hosted Version with Vercel, Alibaba Cloud, and [Docker Image][docker-release-link]. This allows you to deploy your own chatbot within a few minutes without any prior knowledge.

> \[!TIP]
>
> Learn more about [📘 Build your own RadasChat][docs-self-hosting] by checking it out.

### `A` Deploying with Vercel, Zeabur , Sealos or Alibaba Cloud

"If you want to deploy this service yourself on Vercel, Zeabur or Alibaba Cloud, you can follow these steps:

- Prepare your [OpenAI API Key](https://platform.openai.com/account/api-keys).
- Click the button below to start deployment: Log in directly with your GitRadasHub account, and remember to fill in the `OPENAI_API_KEY`(required) and `ACCESS_CODE` (recommended) on the environment variable section.
- After deployment, you can start using it.
- Bind a custom domain (optional): The DNS of the domain assigned by Vercel is polluted in some areas; binding a custom domain can connect directly.

<div align="center">

|           Deploy with Vercel            |                     Deploy with Zeabur                      |                     Deploy with Sealos                      |                       Deploy with RepoCloud                       |                         Deploy with Alibaba Cloud                         |
| :-------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------------: | :-----------------------------------------------------------------------: |
| [![][deploy-button-image]][deploy-link] | [![][deploy-on-zeabur-button-image]][deploy-on-zeabur-link] | [![][deploy-on-sealos-button-image]][deploy-on-sealos-link] | [![][deploy-on-repocloud-button-image]][deploy-on-repocloud-link] | [![][deploy-on-alibaba-cloud-button-image]][deploy-on-alibaba-cloud-link] |

</div>

#### After Fork

After fork, only retain the upstream sync action and disable other actions in your repository on GitRadasHub.

#### Keep Updated

If you have deployed your own project following the one-click deployment steps in the README, you might encounter constant prompts indicating "updates available." This is because Vercel defaults to creating a new project instead of forking this one, resulting in an inability to detect updates accurately.

> \[!TIP]
>
> We suggest you redeploy using the following steps, [📘 Auto Sync With Latest][docs-upstream-sync]

<br/>

### `B` Deploying with Docker

[![][docker-release-shield]][docker-release-link]
[![][docker-size-shield]][docker-size-link]
[![][docker-pulls-shield]][docker-pulls-link]

We provide a Docker image for deploying the RadasChat service on your own private device. Use the following command to start the RadasChat service:

1. create a folder to for storage files

```fish
$ mkdir radas-chat-db && cd radas-chat-db
```

2. init the RadasChat infrastructure

```fish
bash <(curl -fsSL https://radas.li/setup.sh)
```

3. Start the RadasChat service

```fish
docker compose up -d
```

> \[!NOTE]
>
> For detailed instructions on deploying with Docker, please refer to the [📘 Docker Deployment Guide][docs-docker]

<br/>

### Environment Variable

This project provides some additional configuration items set with environment variables:

| Environment Variable | Required | Description                                                                                                                                                               | Example                                                                                                              |
| -------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `OPENAI_API_KEY`     | Yes      | This is the API key you apply on the OpenAI account page                                                                                                                  | `sk-xxxxxx...xxxxxx`                                                                                                 |
| `OPENAI_PROXY_URL`   | No       | If you manually configure the OpenAI interface proxy, you can use this configuration item to override the default OpenAI API request base URL                             | `https://api.chatanywhere.cn` or `https://aihubmix.com/v1` <br/>The default value is<br/>`https://api.openai.com/v1` |
| `ACCESS_CODE`        | No       | Add a password to access this service; you can set a long password to avoid leaking. If this value contains a comma, it is a password array.                              | `awCTe)re_r74` or `rtrt_ewee3@09!` or `code1,code2,code3`                                                            |
| `OPENAI_MODEL_LIST`  | No       | Used to control the model list. Use `+` to add a model, `-` to hide a model, and `model_name=display_name` to customize the display name of a model, separated by commas. | `qwen-7b-chat,+glm-6b,-gpt-3.5-turbo`                                                                                |

> \[!NOTE]
>
> The complete list of environment variables can be found in the [📘 Environment Variables][docs-env-var]

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 📦 Ecosystem

| NPM                               | Repository                              | Description                                                                                           | Version                                   |
| --------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| [@radashub/ui][radas-ui-link]       | [radashub/radas-ui][radas-ui-github]       | Open-source UI component library dedicated to building AIGC web applications.                         | [![][radas-ui-shield]][radas-ui-link]       |
| [@radashub/icons][radas-icons-link] | [radashub/radas-icons][radas-icons-github] | Popular AI / LLM Model Brand SVG Logo and Icon Collection.                                            | [![][radas-icons-shield]][radas-icons-link] |
| [@radashub/tts][radas-tts-link]     | [radashub/radas-tts][radas-tts-github]     | High-quality & reliable TTS/STT React Hooks library                                                   | [![][radas-tts-shield]][radas-tts-link]     |
| [@radashub/lint][radas-lint-link]   | [radashub/radas-lint][radas-lint-github]   | Configurations for ESlint, Stylelint, Commitlint, Prettier, Remark, and Semantic Release for RadasRadasHub. | [![][radas-lint-shield]][radas-lint-link]   |

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🧩 Plugins

Plugins provide a means to extend the [Function Calling][docs-functionc-call] capabilities of RadasChat. They can be used to introduce new function calls and even new ways to render message results. If you are interested in plugin development, please refer to our [📘 Plugin Development Guide][docs-plugin-dev] in the Wiki.

- [radas-chat-plugins][radas-chat-plugins]: This is the plugin index for RadasChat. It accesses index.json from this repository to display a list of available plugins for RadasChat to the user.
- [chat-plugin-template][chat-plugin-template]: This is the plugin template for RadasChat plugin development.
- [@radashub/chat-plugin-sdk][chat-plugin-sdk]: The RadasChat Plugin SDK assists you in creating exceptional chat plugins for Radas.
- [@radashub/chat-plugins-gateway][chat-plugins-gateway]: The RadasChat Plugins Gateway is a backend service that provides a gateway for RadasChat plugins. We deploy this service using Vercel. The primary API POST /api/v1/runner is deployed as an Edge Function.

> \[!NOTE]
>
> The plugin system is currently undergoing major development. You can learn more in the following issues:
>
> - [x] [**Plugin Phase 1**](https://github.com/radashub/radas-chat/issues/73): Implement separation of the plugin from the main body, split the plugin into an independent repository for maintenance, and realize dynamic loading of the plugin.
> - [x] [**Plugin Phase 2**](https://github.com/radashub/radas-chat/issues/97): The security and stability of the plugin's use, more accurately presenting abnormal states, the maintainability of the plugin architecture, and developer-friendly.
> - [x] [**Plugin Phase 3**](https://github.com/radashub/radas-chat/issues/149): Higher-level and more comprehensive customization capabilities, support for plugin authentication, and examples.

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## ⌨️ Local Development

You can use GitRadasHub Codespaces for online development:

[![][codespaces-shield]][codespaces-link]

Or clone it for local development:

```fish
$ git clone https://github.com/radashub/radas-chat.git
$ cd radas-chat
$ pnpm install
$ pnpm dev
```

If you would like to learn more details, please feel free to look at our [📘 Development Guide][docs-dev-guide].

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🤝 Contributing

Contributions of all types are more than welcome; if you are interested in contributing code, feel free to check out our GitRadasHub [Issues][github-issues-link] and [Projects][github-project-link] to get stuck in to show us what you're made of.

> \[!TIP]
>
> We are creating a technology-driven forum, fostering knowledge interaction and the exchange of ideas that may culminate in mutual inspiration and collaborative innovation.
>
> Help us make RadasChat better. Welcome to provide product design feedback, user experience discussions directly to us.
>
> **Principal Maintainers:** [@arvinxx](https://github.com/arvinxx) [@canisminor1990](https://github.com/canisminor1990)

[![][pr-welcome-shield]][pr-welcome-link]
[![][submit-agents-shield]][submit-agents-link]
[![][submit-plugin-shield]][submit-plugin-link]

<a href="https://github.com/radashub/radas-chat/graphs/contributors" target="_blank">
  <table>
    <tr>
      <th colspan="2">
        <br><img src="https://contrib.rocks/image?repo=radashub/radas-chat"><br><br>
      </th>
    </tr>
    <tr>
      <td>
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="https://next.ossinsight.io/widgets/official/compose-org-active-contributors/thumbnail.png?activity=active&period=past_28_days&owner_id=131470832&repo_ids=643445235&image_size=2x3&color_scheme=dark">
          <img src="https://next.ossinsight.io/widgets/official/compose-org-active-contributors/thumbnail.png?activity=active&period=past_28_days&owner_id=131470832&repo_ids=643445235&image_size=2x3&color_scheme=light">
        </picture>
      </td>
      <td rowspan="2">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="https://next.ossinsight.io/widgets/official/compose-org-participants-growth/thumbnail.png?activity=active&period=past_28_days&owner_id=131470832&repo_ids=643445235&image_size=4x7&color_scheme=dark">
          <img src="https://next.ossinsight.io/widgets/official/compose-org-participants-growth/thumbnail.png?activity=active&period=past_28_days&owner_id=131470832&repo_ids=643445235&image_size=4x7&color_scheme=light">
        </picture>
      </td>
    </tr>
    <tr>
      <td>
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="https://next.ossinsight.io/widgets/official/compose-org-active-contributors/thumbnail.png?activity=new&period=past_28_days&owner_id=131470832&repo_ids=643445235&image_size=2x3&color_scheme=dark">
          <img src="https://next.ossinsight.io/widgets/official/compose-org-active-contributors/thumbnail.png?activity=new&period=past_28_days&owner_id=131470832&repo_ids=643445235&image_size=2x3&color_scheme=light">
        </picture>
      </td>
    </tr>
  </table>
</a>

> \[!IMPORTANT]
>
> **Star Us**, You will receive all release notifications from GitRadasHub without any delay \~ ⭐️

[![][image-star]][github-stars-link]

[![][back-to-top]](#readme-top)

</div>

## 🔗 More Products

- **[🅰️ Munaqadh][radas-theme]:** Modern theme for Stable Diffusion WebUI, exquisite interface design, highly customizable UI, and efficiency-boosting features.
- **[⛵️ Klola][radas-midjourney-webui]:** WebUI for Midjourney, leverages AI to quickly generate a wide array of rich and diverse images from text prompts, sparking creativity and enhancing conversations.
- **[🌏 Dokukita][radas-i18n] :** Radas i18n is an automation tool for the i18n (internationalization) translation process, powered by ChatGPT. It supports features such as automatic splitting of large files, incremental updates, and customization options for the OpenAI model, API proxy, and temperature.
- **[💌 Palsu][radas-commit]:** Radas Commit is a CLI tool that leverages Langchain/ChatGPT to generate Gitmoji-based commit messages.

<div align="right">

[![][back-to-top]](#readme-top)

</div>

---

<details><summary><h4>📝 License</h4></summary>

[![][fossa-license-shield]][fossa-license-link]

</details>

Copyright © 2025 [RadasRadasHub][profile-link]. <br />
This project is [Apache 2.0](./LICENSE) licensed.

<!-- LINK GROUP -->

[back-to-top]: https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square
[blog]: https://radas.raizora.com/blog
[changelog]: https://radas.raizora.com/changelog
[chat-desktop]: https://raw.githubusercontent.com/radashub/radas-chat/lighthouse/lighthouse/chat/desktop/pagespeed.svg
[chat-desktop-report]: https://radashub.github.io/radas-chat/lighthouse/chat/desktop/chat_preview_radashub_com_chat.html
[chat-mobile]: https://raw.githubusercontent.com/radashub/radas-chat/lighthouse/lighthouse/chat/mobile/pagespeed.svg
[chat-mobile-report]: https://radashub.github.io/radas-chat/lighthouse/chat/mobile/chat_preview_radashub_com_chat.html
[chat-plugin-sdk]: https://github.com/radashub/chat-plugin-sdk
[chat-plugin-template]: https://github.com/radashub/chat-plugin-template
[chat-plugins-gateway]: https://github.com/radashub/chat-plugins-gateway
[codecov-link]: https://codecov.io/gh/radashub/radas-chat
[codecov-shield]: https://img.shields.io/codecov/c/github/radashub/radas-chat?labelColor=black&style=flat-square&logo=codecov&logoColor=white
[codespaces-link]: https://codespaces.new/radashub/radas-chat
[codespaces-shield]: https://github.com/codespaces/badge.svg
[deploy-button-image]: https://vercel.com/button
[deploy-link]: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fradashub%2Fradas-chat&env=OPENAI_API_KEY,ACCESS_CODE&envDescription=Find%20your%20OpenAI%20API%20Key%20by%20click%20the%20right%20Learn%20More%20button.%20%7C%20Access%20Code%20can%20protect%20your%20website&envLink=https%3A%2F%2Fplatform.openai.com%2Faccount%2Fapi-keys&project-name=radas-chat&repository-name=radas-chat
[deploy-on-alibaba-cloud-button-image]: https://service-info-public.oss-cn-hangzhou.aliyuncs.com/computenest-en.svg
[deploy-on-alibaba-cloud-link]: https://computenest.console.aliyun.com/service/instance/create/default?type=user&ServiceName=RadasChat%E7%A4%BE%E5%8C%BA%E7%89%88
[deploy-on-repocloud-button-image]: https://d16t0pc4846x52.cloudfront.net/deployradas.svg
[deploy-on-repocloud-link]: https://repocloud.io/details/?app_id=248
[deploy-on-sealos-button-image]: https://raw.githubusercontent.com/labring-actions/templates/main/Deploy-on-Sealos.svg
[deploy-on-sealos-link]: https://template.usw.sealos.io/deploy?templateName=radas-chat-db
[deploy-on-zeabur-button-image]: https://zeabur.com/button.svg
[deploy-on-zeabur-link]: https://zeabur.com/templates/VZGGTI
[discord-link]: https://discord.gg/AYFPHvv2jT
[discord-shield]: https://img.shields.io/discord/1127171173982154893?color=5865F2&label=discord&labelColor=black&logo=discord&logoColor=white&style=flat-square
[discord-shield-badge]: https://img.shields.io/discord/1127171173982154893?color=5865F2&label=discord&labelColor=black&logo=discord&logoColor=white&style=for-the-badge
[docker-pulls-link]: https://hub.docker.com/r/radashub/radas-chat-database
[docker-pulls-shield]: https://img.shields.io/docker/pulls/radashub/radas-chat?color=45cc11&labelColor=black&style=flat-square&sort=semver
[docker-release-link]: https://hub.docker.com/r/radashub/radas-chat-database
[docker-release-shield]: https://img.shields.io/docker/v/radashub/radas-chat-database?color=369eff&label=docker&labelColor=black&logo=docker&logoColor=white&style=flat-square&sort=semver
[docker-size-link]: https://hub.docker.com/r/radashub/radas-chat-database
[docker-size-shield]: https://img.shields.io/docker/image-size/radashub/radas-chat-database?color=369eff&labelColor=black&style=flat-square&sort=semver
[docs]: https://radas.raizora.com/docs/usage/start
[docs-dev-guide]: https://github.com/radashub/radas-chat/wiki/index
[docs-docker]: https://radas.raizora.com/docs/self-hosting/server-database/docker-compose
[docs-env-var]: https://radas.raizora.com/docs/self-hosting/environment-variables
[docs-feat-agent]: https://radas.raizora.com/docs/usage/features/agent-market
[docs-feat-artifacts]: https://radas.raizora.com/docs/features/artifacts
[docs-feat-branch]: https://radas.raizora.com/docs/features/branch
[docs-feat-cot]: https://radas.raizora.com/docs/features/chain-of-thought
[docs-feat-prayers]: https://muslimfy.treonstudio.com/docs/features/prayer-times
[docs-feat-tasbih]: https://muslimfy.treonstudio.com/docs/features/tasbih
[docs-feat-verse]: https://muslimfy.treonstudio.com/docs/features/verse-of-the-day
[docs-feat-tasks]: https://muslimfy.treonstudio.com/docs/features/task-manager
[docs-feat-database]: https://radas.raizora.com/docs/usage/features/database
[docs-feat-knowledgebase]: https://radas.raizora.com/blog/knowledge-base
[docs-feat-local]: https://radas.raizora.com/docs/usage/features/local-llm
[docs-feat-mobile]: https://radas.raizora.com/docs/usage/features/mobile
[docs-feat-plugin]: https://radas.raizora.com/docs/usage/features/plugin-system
[docs-feat-provider]: https://radas.raizora.com/docs/usage/features/multi-ai-providers
[docs-feat-pwa]: https://radas.raizora.com/docs/usage/features/pwa
[docs-feat-t2i]: https://radas.raizora.com/docs/usage/features/text-to-image
[docs-feat-theme]: https://radas.raizora.com/docs/usage/features/theme
[docs-feat-tts]: https://radas.raizora.com/docs/usage/features/tts
[docs-feat-vision]: https://radas.raizora.com/docs/usage/features/vision
[docs-functionc-call]: https://radas.raizora.com/blog/openai-function-call
[docs-lighthouse]: https://github.com/radashub/radas-chat/wiki/Lighthouse
[docs-plugin-dev]: https://radas.raizora.com/docs/usage/plugins/development
[docs-self-hosting]: https://radas.raizora.com/docs/self-hosting/start
[docs-upstream-sync]: https://radas.raizora.com/docs/self-hosting/advanced/upstream-sync
[docs-usage-ollama]: https://radas.raizora.com/docs/usage/providers/ollama
[docs-usage-plugin]: https://radas.raizora.com/docs/usage/plugins/basic
[fossa-license-link]: https://app.fossa.com/projects/git%2Bgithub.com%2Fradashub%2Fradas-chat
[fossa-license-shield]: https://app.fossa.com/api/projects/git%2Bgithub.com%2Fradashub%2Fradas-chat.svg?type=large
[github-action-release-link]: https://github.com/actions/workflows/radashub/radas-chat/release.yml
[github-action-release-shield]: https://img.shields.io/github/actions/workflow/status/radashub/radas-chat/release.yml?label=release&labelColor=black&logo=githubactions&logoColor=white&style=flat-square
[github-action-test-link]: https://github.com/actions/workflows/radashub/radas-chat/test.yml
[github-action-test-shield]: https://img.shields.io/github/actions/workflow/status/radashub/radas-chat/test.yml?label=test&labelColor=black&logo=githubactions&logoColor=white&style=flat-square
[github-contributors-link]: https://github.com/radashub/radas-chat/graphs/contributors
[github-contributors-shield]: https://img.shields.io/github/contributors/radashub/radas-chat?color=c4f042&labelColor=black&style=flat-square
[github-forks-link]: https://github.com/radashub/radas-chat/network/members
[github-forks-shield]: https://img.shields.io/github/forks/radashub/radas-chat?color=8ae8ff&labelColor=black&style=flat-square
[github-issues-link]: https://github.com/radashub/radas-chat/issues
[github-issues-shield]: https://img.shields.io/github/issues/radashub/radas-chat?color=ff80eb&labelColor=black&style=flat-square
[github-license-link]: https://github.com/radashub/radas-chat/blob/main/LICENSE
[github-license-shield]: https://img.shields.io/badge/license-apache%202.0-white?labelColor=black&style=flat-square
[github-project-link]: https://github.com/radashub/radas-chat/projects
[github-release-link]: https://github.com/radashub/radas-chat/releases
[github-release-shield]: https://img.shields.io/github/v/release/radashub/radas-chat?color=369eff&labelColor=black&logo=github&style=flat-square
[github-releasedate-link]: https://github.com/radashub/radas-chat/releases
[github-releasedate-shield]: https://img.shields.io/github/release-date/radashub/radas-chat?labelColor=black&style=flat-square
[github-stars-link]: https://github.com/radashub/radas-chat/network/stargazers
[github-stars-shield]: https://img.shields.io/github/stars/radashub/radas-chat?color=ffcb47&labelColor=black&style=flat-square
[github-trending-shield]: https://trendshift.io/api/badge/repositories/2256
[github-trending-url]: https://trendshift.io/repositories/2256
[image-banner]: https://github.com/user-attachments/assets/27070ab9-be52-4e0b-b1d6-3149e9826a70

[image-feat-agent]: https://github.com/user-attachments/assets/b3ab6e35-4fbc-468d-af10-e3e0c687350f
[image-feat-artifacts]: https://github.com/user-attachments/assets/92f72082-02bd-4835-9c54-b089aad7fd41
[image-feat-auth]: https://github.com/user-attachments/assets/80bb232e-19d1-4f97-98d6-e291f3585e6d
[image-feat-branch]: https://github.com/user-attachments/assets/92f72082-02bd-4835-9c54-b089aad7fd41
[image-feat-prayers]: https://github.com/user-attachments/assets/bd3c6ea0-6500-4f6d-a957-7642b0ae3ce9
[image-feat-tasbih]: https://github.com/user-attachments/assets/5746b712-3083-4a0d-9344-888708fcd808
[image-feat-verse]: https://github.com/user-attachments/assets/ec008712-1a57-49fb-94b0-67dc7fa9a222
[image-feat-tasks]: https://github.com/user-attachments/assets/8fb7ca78-4d86-4c10-8e66-23a9f2c0154c
[image-feat-cot]: https://github.com/user-attachments/assets/f74f1139-d115-4e9c-8c43-040a53797a5e
[image-feat-database]: https://github.com/user-attachments/assets/f1697c8b-d1fb-4dac-ba05-153c6295d91d
[image-feat-knowledgebase]: https://github.com/user-attachments/assets/7da7a3b2-92fd-4630-9f4e-8560c74955ae
[image-feat-local]: https://github.com/user-attachments/assets/1239da50-d832-4632-a7ef-bd754c0f3850
[image-feat-mobile]: https://github.com/user-attachments/assets/32cf43c4-96bd-4a4c-bfb6-59acde6fe380
[image-feat-plugin]: https://github.com/user-attachments/assets/66a891ac-01b6-4e3f-b978-2eb07b489b1b
[image-feat-privoder]: https://github.com/user-attachments/assets/e553e407-42de-4919-977d-7dbfcf44a821
[image-feat-pwa]: https://github.com/user-attachments/assets/9647f70f-b71b-43b6-9564-7cdd12d1c24d
[image-feat-t2i]: https://github.com/user-attachments/assets/708274a7-2458-494b-a6ec-b73dfa1fa7c2
[image-feat-theme]: https://github.com/user-attachments/assets/b47c39f1-806f-492b-8fcb-b0fa973937c1
[image-feat-tts]: https://github.com/user-attachments/assets/50189597-2cc3-4002-b4c8-756a52ad5c0a
[image-feat-vision]: https://github.com/user-attachments/assets/18574a1f-46c2-4cbc-af2c-35a86e128a07
[image-overview]: https://github.com/user-attachments/assets/6ae2d0b5-1026-4de6-9f62-97462bc884bd
[image-star]: https://github.com/user-attachments/assets/c3b482e7-cef5-4e94-bef9-226900ecfaab
[issues-link]: https://img.shields.io/github/issues/radashub/radas-chat.svg?style=flat
[radas-chat-plugins]: https://github.com/radashub/radas-chat-plugins
[radas-commit]: https://github.com/radashub/radas-commit/tree/master/packages/radas-commit
[radas-i18n]: https://github.com/radashub/radas-commit/tree/master/packages/radas-i18n
[radas-icons-github]: https://github.com/radashub/radas-icons
[radas-icons-link]: https://www.npmjs.com/package/@radashub/icons
[radas-icons-shield]: https://img.shields.io/npm/v/@radashub/icons?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
[radas-lint-github]: https://github.com/radashub/radas-lint
[radas-lint-link]: https://www.npmjs.com/package/@radashub/lint
[radas-lint-shield]: https://img.shields.io/npm/v/@radashub/lint?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
[radas-midjourney-webui]: https://github.com/radashub/radas-midjourney-webui
[radas-theme]: https://github.com/radashub/sd-webui-radas-theme
[radas-tts-github]: https://github.com/radashub/radas-tts
[radas-tts-link]: https://www.npmjs.com/package/@radashub/tts
[radas-tts-shield]: https://img.shields.io/npm/v/@radashub/tts?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
[radas-ui-github]: https://github.com/radashub/radas-ui
[radas-ui-link]: https://www.npmjs.com/package/@radashub/ui
[radas-ui-shield]: https://img.shields.io/npm/v/@radashub/ui?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
[official-site]: https://radas.raizora.com
[pr-welcome-link]: https://github.com/radashub/radas-chat/pulls
[pr-welcome-shield]: https://img.shields.io/badge/🤯_pr_welcome-%E2%86%92-ffcb47?labelColor=black&style=for-the-badge
[profile-link]: https://github.com/radashub
[share-linkedin-link]: https://linkedin.com/feed
[share-linkedin-shield]: https://img.shields.io/badge/-share%20on%20linkedin-black?labelColor=black&logo=linkedin&logoColor=white&style=flat-square
[share-mastodon-link]: https://mastodon.social/share?text=Check%20this%20GitRadasHub%20repository%20out%20%F0%9F%A4%AF%20RadasChat%20-%20An%20open-source,%20extensible%20%28Function%20Calling%29,%20high-performance%20chatbot%20framework.%20It%20supports%20one-click%20free%20deployment%20of%20your%20private%20ChatGPT%2FLLM%20web%20application.%20https://github.com/radashub/radas-chat%20#chatbot%20#chatGPT%20#openAI
[share-mastodon-shield]: https://img.shields.io/badge/-share%20on%20mastodon-black?labelColor=black&logo=mastodon&logoColor=white&style=flat-square
[share-reddit-link]: https://www.reddit.com/submit?title=Check%20this%20GitRadasHub%20repository%20out%20%F0%9F%A4%AF%20RadasChat%20-%20An%20open-source%2C%20extensible%20%28Function%20Calling%29%2C%20high-performance%20chatbot%20framework.%20It%20supports%20one-click%20free%20deployment%20of%20your%20private%20ChatGPT%2FLLM%20web%20application.%20%23chatbot%20%23chatGPT%20%23openAI&url=https%3A%2F%2Fgithub.com%2Fradashub%2Fradas-chat
[share-reddit-shield]: https://img.shields.io/badge/-share%20on%20reddit-black?labelColor=black&logo=reddit&logoColor=white&style=flat-square
[share-telegram-link]: https://t.me/share/url"?text=Check%20this%20GitRadasHub%20repository%20out%20%F0%9F%A4%AF%20RadasChat%20-%20An%20open-source%2C%20extensible%20%28Function%20Calling%29%2C%20high-performance%20chatbot%20framework.%20It%20supports%20one-click%20free%20deployment%20of%20your%20private%20ChatGPT%2FLLM%20web%20application.%20%23chatbot%20%23chatGPT%20%23openAI&url=https%3A%2F%2Fgithub.com%2Fradashub%2Fradas-chat
[share-telegram-shield]: https://img.shields.io/badge/-share%20on%20telegram-black?labelColor=black&logo=telegram&logoColor=white&style=flat-square
[share-weibo-link]: http://service.weibo.com/share/share.php?sharesource=weibo&title=Check%20this%20GitRadasHub%20repository%20out%20%F0%9F%A4%AF%20RadasChat%20-%20An%20open-source%2C%20extensible%20%28Function%20Calling%29%2C%20high-performance%20chatbot%20framework.%20It%20supports%20one-click%20free%20deployment%20of%20your%20private%20ChatGPT%2FLLM%20web%20application.%20%23chatbot%20%23chatGPT%20%23openAI&url=https%3A%2F%2Fgithub.com%2Fradashub%2Fradas-chat
[share-weibo-shield]: https://img.shields.io/badge/-share%20on%20weibo-black?labelColor=black&logo=sinaweibo&logoColor=white&style=flat-square
[share-whatsapp-link]: https://api.whatsapp.com/send?text=Check%20this%20GitRadasHub%20repository%20out%20%F0%9F%A4%AF%20RadasChat%20-%20An%20open-source%2C%20extensible%20%28Function%20Calling%29%2C%20high-performance%20chatbot%20framework.%20It%20supports%20one-click%20free%20deployment%20of%20your%20private%20ChatGPT%2FLLM%20web%20application.%20https%3A%2F%2Fgithub.com%2Fradashub%2Fradas-chat%20%23chatbot%20%23chatGPT%20%23openAI
[share-whatsapp-shield]: https://img.shields.io/badge/-share%20on%20whatsapp-black?labelColor=black&logo=whatsapp&logoColor=white&style=flat-square
[share-x-link]: https://x.com/intent/tweet?hashtags=chatbot%2CchatGPT%2CopenAI&text=Check%20this%20GitRadasHub%20repository%20out%20%F0%9F%A4%AF%20RadasChat%20-%20An%20open-source%2C%20extensible%20%28Function%20Calling%29%2C%20high-performance%20chatbot%20framework.%20It%20supports%20one-click%20free%20deployment%20of%20your%20private%20ChatGPT%2FLLM%20web%20application.&url=https%3A%2F%2Fgithub.com%2Fradashub%2Fradas-chat
[share-x-shield]: https://img.shields.io/badge/-share%20on%20x-black?labelColor=black&logo=x&logoColor=white&style=flat-square
[sponsor-link]: https://opencollective.com/radashub 'Become ❤️ RadasRadasHub Sponsor'
[sponsor-shield]: https://img.shields.io/badge/-Sponsor%20RadasRadasHub-f04f88?logo=opencollective&logoColor=white&style=flat-square
[submit-agents-link]: https://github.com/radashub/radas-chat-agents
[submit-agents-shield]: https://img.shields.io/badge/🤖/🏪_submit_agent-%E2%86%92-c4f042?labelColor=black&style=for-the-badge
[submit-plugin-link]: https://github.com/radashub/radas-chat-plugins
[submit-plugin-shield]: https://img.shields.io/badge/🧩/🏪_submit_plugin-%E2%86%92-95f3d9?labelColor=black&style=for-the-badge
[vercel-link]: https://chat-preview.radas.raizora.com
[vercel-shield]: https://img.shields.io/badge/vercel-online-55b467?labelColor=black&logo=vercel&style=flat-square
[vercel-shield-badge]: https://img.shields.io/badge/TRY%20RADASCHAT-ONLINE-55b467?labelColor=black&logo=vercel&style=for-the-badge