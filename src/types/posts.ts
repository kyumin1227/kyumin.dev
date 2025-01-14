interface iPost {
  title: string;
  description: string;
  date: Date;
  content: string;
  tags: string[];
}

interface iPosts {
  series: string;
  posts: iPost[];
}
