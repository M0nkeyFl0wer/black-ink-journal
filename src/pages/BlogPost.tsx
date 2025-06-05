
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Tag, Share2, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const BlogPost = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Header */}
      <header className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <Link to="/" className="flex items-center space-x-4">
          <img 
            src="/lovable-uploads/82867a2d-c687-4042-992d-c0841d74606e.png" 
            alt="Ben West" 
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h1 className="text-xl font-bold">Ben West</h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Essays & Commentary</p>
          </div>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-6 py-12">
        {/* Back link */}
        <Link 
          to="/" 
          className={`inline-flex items-center transition-colors mb-8 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>

        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-center space-x-4 mb-6">
            <span className="inline-block px-3 py-1 text-sm bg-red-600 text-white rounded">
              <Tag className="w-3 h-3 inline mr-1" />
              ESSAYS
            </span>
            <span className={`flex items-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <Calendar className="w-4 h-4 mr-1" />
              May 16, 2025
            </span>
          </div>
          
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Still Crowned
          </h1>
          
          <p className={`text-xl leading-relaxed mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
            A country that talks like a democracy but still curtsies like a colony
          </p>
          
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/82867a2d-c687-4042-992d-c0841d74606e.png" 
              alt="Ben West" 
              className="w-8 h-8 rounded-full mr-3"
            />
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>By Ben West</span>
          </div>
        </header>

        {/* Hero Image - Parliament Screenshot */}
        <div className="mb-12">
          <img 
            src="/lovable-uploads/61703bd2-7bd9-4d04-b4af-f6e6d12cc735.png"
            alt="King Charles III delivering the Speech from the Throne in Parliament"
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        {/* Article Content */}
        <div className={`prose prose-lg max-w-none ${isDarkMode ? 'prose-invert' : 'prose-gray'}`}>
          <p className={`text-lg leading-relaxed mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
            At the recent swearing-in ceremony for Canada's newest ministers, one detail stood out. Not the cabinet picks (we could talk about that too), but the words they were made to say: a solemn pledge of allegiance to "His Majesty King Charles the Third, his heirs and successors."
          </p>

          <p className={`text-lg leading-relaxed mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
            In 2025. In a modern democracy. In a country where we pride ourselves on being independent, progressive, and self-governing, we are still asking ministers to pledge fealty not to the people, not even to the Constitution, but to a literal king.
          </p>

          <div className="my-12">
            <img 
              src="/lovable-uploads/453c6f64-8fa5-42fe-acd7-12058b4862ac.png"
              alt="Canadian minister taking oath of office"
              className="w-full h-96 object-cover rounded-lg"
            />
            <p className={`text-center text-sm mt-4 italic ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              The solemn pledge of allegiance to the Crown continues in 2025.
            </p>
          </div>

          <p className={`text-lg leading-relaxed mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
            And not just a king. This king. The guy who couldn't even get his own pens to work during his coronation tour. The guy who wears jewels stolen from colonized nations and sits atop an institution built on centuries of slavery, imperialism, and violent dispossession.
          </p>

          <p className={`text-lg leading-relaxed mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
            Let's be clear. This isn't just ceremonial fluff. Canada may pretend to be a modern democracy with a decorative crown, but the reality is more twisted. We are a monarchy pretending not to be one. The consequences of that show up in subtle and not-so-subtle ways.
          </p>

          <p className={`text-lg leading-relaxed mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
            Today, King Charles III is delivering the Speech from the Throne. This marks the first time in 48 years that a reigning monarch has done so in Canada, and only the third time ever. Queen Elizabeth II read the speech in 1957 and again in 1977, both during symbolic royal tours. But this one hits differently. It is not just a visit. It is a reminder.
          </p>

          <div className="my-12">
            <img 
              src="/lovable-uploads/df044dcd-032f-40de-9ec9-74a2eee4d38a.png"
              alt="Official portrait of King Charles III"
              className="w-full h-96 object-cover rounded-lg"
            />
            <p className={`text-center text-sm mt-4 italic ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Still here. Still crowned.
            </p>
          </div>

          <p className={`text-lg leading-relaxed mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
            A symbolic move, sure. But symbols matter. And in the context of a rising authoritarian wave south of the border, the timing feels more than ironic.
          </p>

          <p className={`text-lg leading-relaxed mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
            Because while the Republican Party in the U.S. has rallied behind a man who believes he is a king, here we are in Canada claiming we are not one, while having our ministers swear loyalty to a royal family. It is cosplay constitutionalism. And I say this with respect to cosplay.
          </p>

          <div className="my-12">
            <img 
              src="/lovable-uploads/0d6b2dba-6fa3-4f5b-9d6a-c7a03f4d5aa7.png"
              alt="King Charles III speaking at podium"
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>

          <p className={`text-lg leading-relaxed mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
            The irony goes deeper. People who oppose monarchy are often labeled republicans, as if rejecting hereditary power aligns them with the authoritarian brand now controlling the U.S. Republican Party. We need a better word. Because the answer to one totalitarian regime is not to run back to the mothership of imperial institutions and a deeply corrupt family.
          </p>

          <p className={`text-lg leading-relaxed mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
            Now, you might be saying, "Ben, come on. The monarchy doesn't really have power in Canada." But it does. Not in the daily business of government, no. But in moments of crisis, the Crown's representatives, our Governor General and the Lieutenant Governors, hold real reserve powers. They have exercised them before. They could again.
          </p>

          <div className={`my-12 p-6 rounded-lg border-l-4 border-red-600 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <p className={`text-lg leading-relaxed mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
              Remember 2017? Christy Clark, then Premier of British Columbia, lost the confidence of the Legislature. Rather than dissolve Parliament as she requested, Lieutenant Governor Judith Guichon invited John Horgan to form government. That is not just a ribbon-cutting role. That is power.
            </p>
          </div>

          <p className={`text-lg leading-relaxed mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
            Or take Stephen Harper's 2008 prorogation crisis. Facing a confidence vote he was likely to lose, he asked the Governor General to prorogue Parliament. Michaëlle Jean agreed. Many framed it as a wise avoidance of crisis. But in truth, a majority of MPs had signed a letter expressing their desire to form an alternative government. The Governor General made a choice. She backed the sitting Prime Minister instead of the stated will of the majority. That is not democratic restraint. That is institutional bias dressed up as neutrality.
          </p>

          <div className="my-12">
            <img 
              src="/lovable-uploads/6def8f02-867c-4f10-ae29-87a5c29c4322.png"
              alt="Minister pledging allegiance during swearing-in ceremony"
              className="w-full h-64 object-cover rounded-lg"
            />
            <p className={`text-center text-sm mt-4 italic ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Marjorie Michel being sworn in as Minister of Health, pledging "true allegiance" to King Charles III — as seen in CBC's live broadcast of Carney's new cabinet.
            </p>
          </div>

          <p className={`text-lg leading-relaxed mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
            Mark Carney, now Prime Minister and former head of both the Bank of Canada and the Bank of England, has defended this arrangement as a bulwark of Canadian sovereignty. But is it? Or is it just stability through tradition? Are we clinging to symbols of empire to avoid real conversations about democratic renewal?
          </p>

          <p className={`text-lg leading-relaxed mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
            Our sovereignty should reflect our values. It should be rooted in accountability, justice, and the will of the people, not a colonial tradition or a crown passed down by birthright. We are more than a subject nation, and our future depends on acting like it.
          </p>
        </div>

        {/* Article Footer */}
        <footer className={`border-t pt-8 mt-12 ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/82867a2d-c687-4042-992d-c0841d74606e.png" 
                alt="Ben West" 
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-bold">Ben West</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Essays & Commentary</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default BlogPost;
