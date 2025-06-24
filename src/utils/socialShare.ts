
export interface ShareData {
  url: string;
  title: string;
  text: string;
  hashtags?: string[];
}

export const shareToTwitter = ({ url, title, text, hashtags = [] }: ShareData) => {
  const tweetText = `${text} ${title}`;
  const hashtagString = hashtags.length > 0 ? ` ${hashtags.map(tag => `#${tag}`).join(' ')}` : '';
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText + hashtagString)}&url=${encodeURIComponent(url)}`;
  
  window.open(twitterUrl, '_blank', 'width=600,height=400');
};

export const shareToFacebook = ({ url }: ShareData) => {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(facebookUrl, '_blank', 'width=600,height=400');
};

export const shareToLinkedIn = ({ url, title, text }: ShareData) => {
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(text)}`;
  window.open(linkedInUrl, '_blank', 'width=600,height=400');
};

export const shareToReddit = ({ url, title }: ShareData) => {
  const redditUrl = `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
  window.open(redditUrl, '_blank', 'width=600,height=400');
};

export const shareViaNativeAPI = async ({ url, title, text }: ShareData) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url,
      });
      return true;
    } catch (error) {
      console.error('Error sharing:', error);
      return false;
    }
  }
  return false;
};

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
};

export const generateRaceShareData = (raceName: string, prediction?: string): ShareData => {
  const url = window.location.href;
  const baseText = `🏎️ ${raceName} is happening now!`;
  const text = prediction ? `${baseText} My prediction: ${prediction}` : baseText;
  
  return {
    url,
    title: `F1 ${raceName}`,
    text,
    hashtags: ['F1', 'Formula1', 'Racing', 'F1BoxBox']
  };
};

export const generateDriverShareData = (driverName: string, achievement?: string): ShareData => {
  const url = window.location.href;
  const baseText = `🏆 ${driverName} - F1 Driver Profile`;
  const text = achievement ? `${baseText} - ${achievement}` : baseText;
  
  return {
    url,
    title: `${driverName} - F1 Driver`,
    text,
    hashtags: ['F1', 'Formula1', driverName.replace(' ', '')]
  };
};
