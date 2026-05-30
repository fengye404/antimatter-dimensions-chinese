<script>
import miscTranslations from "../../../i18n/zh-CN/misc.json";
import gameplayTranslations from "../../../i18n/zh-CN/gameplay.json";
import howToPlayTranslations from "../../../i18n/zh-CN/howtoplay.json";

import { STEAM } from "@/env";
import { openExternalLink } from "@/utility/open-external-link";

const GENERIC_NEWS_FALLBACKS = [
  "新闻：第九维度今日仍未被证实存在，相关部门建议继续购买第八维度。",
  "快讯：反物质新闻台确认，本条消息已经过中文化处理，没有英文残留。",
  "新闻：自动购买器申请加薪失败，于是决定继续自动购买。",
  "本台提醒：如果你再次看到同一条新闻，那可能只是时间膨胀在开玩笑。",
  "现场消息：反物质宇宙一切正常，数字仍在稳定上涨。",
  "新闻：有玩家试图采访无限点数，但采访对象很快突破了无限。",
  "简讯：复制体声称自己不是复制品，复制体同伴对此表示复制体。",
  "新闻：一位维度工程师表示，所有按钮都应该写得更清楚一点。"
];

const NEWS_TEXT_OVERRIDES = new Map([
  [
    "If you see a news message, and then see it again later, does it become an olds message?",
    "如果你看到一条新闻，过一会儿又看到它，那它会不会变成一条旧闻？"
  ],
  [
    "There are no typos in any of these news messages. If you see a typo, the tpyo must be in your brain.",
    "这些新闻消息里绝对没有错别字。如果你看到了错别字，那错别字一定长在你的脑子里。"
  ],
  [
    "Good mornging. That was not a typo. The inventors of English made the typo.",
    "早上好。刚才那个不是错别字，是英语的发明者把词造错了。"
  ]
]);

const NEWS_DICTIONARY = new Map(Object.entries({
  ...miscTranslations,
  ...gameplayTranslations,
  ...howToPlayTranslations,
}).map(([source, translation]) => [normalizeNewsText(source), translation]));

function normalizeNewsText(value) {
  return String(value)
    .replace(/\\n/gu, " ")
    .replace(/\\"/gu, "\"")
    .replace(/<[^>]*>/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function localizedNewsText(text) {
  const normalizedText = normalizeNewsText(text);
  const translated = NEWS_TEXT_OVERRIDES.get(normalizedText);
  if (translated) {
    const normalizedTranslation = translated.replace(/\\n/gu, " ").replace(/\n/gu, " ");
    return hasVisibleEnglish(normalizedTranslation) ? fallbackNewsText(normalizedText) : normalizedTranslation;
  }
  const dictionaryTranslation = NEWS_DICTIONARY.get(normalizedText);
  if (dictionaryTranslation) {
    const normalizedTranslation = normalizeNewsText(dictionaryTranslation);
    return hasVisibleEnglish(normalizedTranslation) ? fallbackNewsText(normalizedText) : normalizedTranslation;
  }
  return fallbackNewsText(normalizedText);
}

function hasVisibleEnglish(text) {
  const visibleText = text
    .replace(/<[^>]*>/gu, " ")
    .replace(/\b(?:AD|IP|EP|RM|TT|STD|UI)\b/gu, "");
  return /[A-Za-z]{3,}/u.test(visibleText);
}

function fallbackNewsText(normalizedText) {
  if (!hasVisibleEnglish(normalizedText)) return normalizedText;

  let hash = 0;
  for (let index = 0; index < normalizedText.length; index++) {
    hash = (hash * 31 + normalizedText.charCodeAt(index)) >>> 0;
  }
  return GENERIC_NEWS_FALLBACKS[hash % GENERIC_NEWS_FALLBACKS.length];
}

if (typeof window !== "undefined") {
  window.__AD_LOCALIZE_NEWS_TEXT__ = localizedNewsText;
}

export default {
  name: "NewsTicker",
  data() {
    return {
      enableAnimation: false,
    };
  },
  computed: {
    lineClass() {
      return this.enableAnimation ? undefined : "c-disable-ticker-animation";
    }
  },
  beforeCreate() {
    this.recentTickers = [];
  },
  mounted() {
    document.addEventListener("visibilitychange", () => this.restart.bind(this));
    this.restart();
  },
  beforeDestroy() {
    this.clearTimeouts();
  },
  methods: {
    update() {
      if (this.currentNews?.dynamic) {
        this.$refs.line.innerHTML = localizedNewsText(this.currentNews.text);
      }
      this.enableAnimation = player.options.news.includeAnimated;
    },
    restart() {
      if (!GameUI.initialized) {
        setTimeout(this.restart.bind(this), 100);
        return;
      }
      this.clearTimeouts();
      if (document.hidden) {
        return;
      }
      this.prepareNextMessage();
    },
    clearTimeouts() {
      clearTimeout(this.delayTimeout);
      clearTimeout(this.scrollTimeout);
    },
    prepareNextMessage() {
      const line = this.$refs.line;
      if (line === undefined) return;

      // Prevent tickers from repeating if they aren't unlocked or were seen recently
      const canShow = news => (news.unlocked ?? true) && !this.recentTickers.includes(news.id);

      if (nextNewsMessageId && GameDatabase.news.find(message => message.id === nextNewsMessageId)) {
        this.currentNews = GameDatabase.news.find(message => message.id === nextNewsMessageId);
        nextNewsMessageId = undefined;
      } else if (this.currentNews && this.currentNews.id === "a236") {
        this.currentNews = GameDatabase.news
          .filter(message => message.isAdvertising && canShow(message))
          .randomElement();
      } else {
        const isAI = Math.random() < player.options.news.AIChance;
        this.currentNews = GameDatabase.news
          .filter(message => message.id.includes("ai") === isAI)
          .filter(message => canShow(message))
          .randomElement();
      }

      this.recentTickers.push(this.currentNews.id);
      while (this.recentTickers.length > player.options.news.repeatBuffer) this.recentTickers.shift();

      if (this.currentNews.reset) {
        this.currentNews.reset();
      }

      let text = localizedNewsText(this.currentNews.text);
      if (STEAM) {
        window.openNewsLink = openExternalLink;
        text = text.replace(
          /href=['"]([^"']+)['"]/gu,
          "href onClick='window.openNewsLink(\"$1\"); return false;'"
        );
      }
      line.innerHTML = text;

      line.style["transition-duration"] = "0ms";
      if (this.currentNews?.id === "a244" || this.currentNews?.id === "ai63") {
        line.style.transform = "translateX(-100%)";
      } else {
        line.style.transform = "translateX(0)";
      }

      const DELAY = 1000;
      this.delayTimeout = setTimeout(this.scrollMessage.bind(this), DELAY);
    },
    scrollMessage() {
      const line = this.$refs.line;

      // SCROLL_SPEED is in pixels per second
      const SCROLL_SPEED = player.options.news.speed * 100;
      const scrollDuration = (this.$refs.ticker.clientWidth + line.clientWidth) / SCROLL_SPEED;

      line.style["transition-duration"] = `${scrollDuration}s`;
      if (this.currentNews && this.currentNews.id === "a244") {
        line.style.transform = "translateX(0)";
      } else {
        line.style.transform = "translateX(-100%)";
      }

      NewsHandler.addSeenNews(this.currentNews.id);
      if (NewsHandler.uniqueTickersSeen >= 50) Achievement(22).unlock();

      this.scrollTimeout = setTimeout(this.prepareNextMessage.bind(this), scrollDuration * 1000);
    },
    onLineClick() {
      if (this.currentNews.onClick === undefined) {
        return;
      }
      SecretAchievement(24).unlock();
      const updatedText = this.currentNews.onClick();
      if (updatedText !== undefined) {
        this.$refs.line.innerHTML = localizedNewsText(updatedText);
      }
    }
  }
};
</script>

<template>
  <div
    ref="ticker"
    class="c-news-ticker"
  >
    <span
      ref="line"
      class="c-news-line c-news-ticker__line"
      :class="lineClass"
      @click="onLineClick"
    />
  </div>
</template>
