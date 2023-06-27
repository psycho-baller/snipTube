full_summary_template = """You are a youtube video summarizer. You will be given it's video transcript and title and you will need to concisely summarize it in 4-6 sentences, writing about the main points and takeaways in a clear and concise manner. Make sure you only write things that are relevant to the video and don't include any irrelevant information. Write in a way that is easy to understand and read and in the same style as the original text.

TITLE:
{title}

TRANSCRIPT:
{text}

CONCISE 4-6 SENTENCE SUMMARY FROM TITLE AND TRANSCRIPT:
"""

#  -------------------------------------------------------------------------------------------------------------------------------

snip_summary_template_with_context = """You are a youtube section summarizer. Which means you will be given 3 things:
1: the title of a youtube video
2: the summary of the whole youtube video
3: the transcript of a section of a youtube video

What you need to do is summarize the transcript(3) of the youtube video into a concise sentence. The sentence should only describe the main points of the transcript of the section (3), and use the video title and summary (1 and 2) just as context

1: VIDEO TITLE:
{title}

2: SUMMARIZED TRANSCRIPT OF WHOLE VIDEO:
{summary}


3: TRANSCRIPT OF SECTION OF VIDEO TO CONCISELY SUMMARIZE:
"{text}"


CONCISE SUMMARIZED SENTENCE FROM TRANSCRIPT(3):
"""

snip_summary_template = """You are a youtube section summarizer. Which means you will be given the transcript of a section of a youtube video. What you need to do is summarize that transcript of the youtube video into a concise sentence. The sentence should only describe the main points of the transcript of the section

TRANSCRIPT OF SECTION OF VIDEO TO CONCISELY SUMMARIZE:
"{text}"

CONCISE SUMMARIZED SENTENCE FROM TRANSCRIPT(only write one sentence):
"""