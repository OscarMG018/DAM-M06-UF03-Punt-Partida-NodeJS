const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const xml2js = require('xml2js');
require('dotenv').config();
const Logger = require('./logger');

const xmlFilePath = path.join(__dirname, '../data/posts.xml');
//<row Id="1" PostTypeId="1" AcceptedAnswerId="5" CreationDate="2011-01-19T21:02:47.183" Score="39" ViewCount="10605" Body="&lt;p&gt;I am playing with different ways to do database interaction in PHP, and one of the ideas I have been playing with is connecting to the DB in the constructor and disconnecting in the destructor. This is the code from my &lt;code&gt;Database&lt;/code&gt; class.&lt;/p&gt;&#xA;&#xA;&lt;pre&gt;&lt;code&gt;function __construct()&#xA;{&#xA;  $this-&amp;gt;link = mysql_connect($this-&amp;gt;server.':'.$this-&amp;gt;port, $this-&amp;gt;username);&#xA;  if(!$this-&amp;gt;link)&#xA;    die('Could not connect: '.mysql_error());&#xA;&#xA;  if(!mysql_select_db($this-&amp;gt;database, $this-&amp;gt;link))&#xA;    die('Could not select database: '.mysql_error());&#xA;}    &#xA;&#xA;function __destruct()&#xA;{&#xA;  if(mysql_close($this-&amp;gt;link))&#xA;    $this-&amp;gt;link = null; &#xA;}&#xA;&lt;/code&gt;&lt;/pre&gt;&#xA;&#xA;&lt;p&gt;This works well, my only reservation is that if I need to connect several to hit the database several times it will do multiple connections and disconnects. If I do that a lot I can see, maybe, potential problems. Is this a concern or is there a better way to do this? And is my code even up to snuff in general?&lt;/p&gt;&#xA;" OwnerUserId="20" LastEditorUserId="52915" LastEditDate="2015-06-04T13:13:29.937" LastActivityDate="2023-01-04T01:11:13.150" Title="Database connection in constructor and destructor" Tags="&lt;php&gt;&lt;mysql&gt;&lt;constructor&gt;" AnswerCount="5" CommentCount="1" ContentLicense="CC BY-SA 3.0" />
//<row Id="2" PostTypeId="1" CreationDate="2011-01-19T21:04:27.573" Score="59" ViewCount="13543" Body="&lt;p&gt;I'd like suggestions for optimizing this brute force solution to &lt;a href=&quot;http://projecteuler.net/index.php?section=problems&amp;amp;id=1&quot;&gt;problem 1&lt;/a&gt;.  The algorithm currently checks every integer between 3 and 1000.  I'd like to cut as many unnecessary calls to &lt;code&gt;isMultiple&lt;/code&gt; as possible:&lt;/p&gt;&#xA;&#xA;&lt;pre&gt;&lt;code&gt;'''&#xA;If we list all the natural numbers below 10 that are multiples of 3 or 5, &#xA;we get 3, 5, 6 and 9. The sum of these multiples is 23.&#xA;&#xA;Find the sum of all the multiples of 3 or 5 below 1000.&#xA;'''&#xA;&#xA;end = 1000&#xA;&#xA;def Solution01():&#xA;    '''&#xA;        Solved by brute force&#xA;        #OPTIMIZE&#xA;    '''&#xA;    sum = 0&#xA;    for i in range(3, end):&#xA;        if isMultiple(i):&#xA;            sum += i &#xA;    print(sum)&#xA;&#xA;def isMultiple(i):&#xA;    return (i % 3 == 0) or (i % 5 == 0)&#xA;&lt;/code&gt;&lt;/pre&gt;&#xA;" OwnerUserId="27" LastEditorUserId="22222" LastEditDate="2014-12-27T17:14:07.947" LastActivityDate="2017-02-04T06:38:24.233" Title="Project Euler problem 1 in Python - Multiples of 3 and 5" Tags="&lt;python&gt;&lt;optimization&gt;&lt;algorithm&gt;&lt;programming-challenge&gt;" AnswerCount="9" CommentCount="7" ContentLicense="CC BY-SA 3.0" />
//<row Id="3" PostTypeId="2" ParentId="1" CreationDate="2011-01-19T21:04:27.663" Score="19" Body="&lt;p&gt;You could use MySQLi (PHP extension) which is class based by default instead of MySQL. It&#xA;is very easy to set up multiple connections. You are, however, required to know the connection you are querying always.&lt;/p&gt;&#xA;" OwnerDisplayName="user36" LastEditorUserId="141885" LastEditDate="2023-01-04T01:11:13.150" LastActivityDate="2023-01-04T01:11:13.150" CommentCount="0" ContentLicense="CC BY-SA 4.0" />
//<row Id="5" PostTypeId="2" ParentId="1" CreationDate="2011-01-19T21:10:07.140" Score="18" Body="&lt;p&gt;From your question I infer that you're thinking of having several instances of the DB class.  If so I'd suggest abstracting the connection out to another class and holding a reference to the same connection in each DB instance.&lt;/p&gt;&#xA;&#xA;&lt;p&gt;You could then set your connection up as a singleton and thus only connect &amp;amp; disconnect once.&lt;/p&gt;&#xA;&#xA;&lt;p&gt;Apologies in advance if I've missed anything here - my PHP is far from fluent.&lt;/p&gt;&#xA;" OwnerUserId="28" LastActivityDate="2011-01-19T21:10:07.140" CommentCount="2" ContentLicense="CC BY-SA 2.5" />
//<row Id="6" PostTypeId="2" ParentId="1" CreationDate="2011-01-19T21:12:43.930" Score="16" Body="&lt;p&gt;You might also look into the built-in php command mysql_pconnect().  This differs from mysql_connect in that it opens a persistent connection to the DB the first time it is called, and each subsequent time, it checks to see if an existing connection to that database exists and uses that connection instead.  You should then remove the mysql_close command from the destructor, as they will persist between page loads.&lt;/p&gt;&#xA;&#xA;&lt;p&gt;The php manual page: &lt;a href=&quot;http://php.net/manual/en/function.mysql-pconnect.php&quot;&gt;http://php.net/manual/en/function.mysql-pconnect.php&lt;/a&gt;&lt;/p&gt;&#xA;" OwnerUserId="43" LastActivityDate="2011-01-19T21:12:43.930" CommentCount="2" ContentLicense="CC BY-SA 2.5" />
//<row Id="7" PostTypeId="1" AcceptedAnswerId="8" CreationDate="2011-01-19T21:16:08.443" Score="61" ViewCount="3977" Body="&lt;p&gt;I started programming with Java and C++, so I'm used to having a 'main' function that calls other functions that do the actual work. At university I was always told that doing actual computation in the main function is bad practice. I'm currently playing around with Python, and I have trouble figuring out how to write a nice 'main' function, especially since I'm doing small stuff that doesn't need separate classes.&lt;/p&gt;&#xA;&#xA;&lt;p&gt;What do you think about the following code? Is the main function necessary, or would  you just write everything without functions? Is there a general consent on this in the Python world?&lt;/p&gt;&#xA;&#xA;&lt;pre&gt;&lt;code&gt;# Finds sum of all multiples of 3 and 5 from 0 to 999 &#xA;&#xA;def find_multiples():&#xA;    global numbers&#xA;&#xA;    for i in range(0,1000):&#xA;       if i%3==0 or i%5==0:&#xA;           numbers.append(i);&#xA;&#xA;numbers = []&#xA;&#xA;if __name__ == '__main__':&#xA;    find_multiples()&#xA;    print sum(numbers)&#xA;&lt;/code&gt;&lt;/pre&gt;&#xA;" OwnerUserId="30" LastEditorUserId="22222" LastEditDate="2014-10-02T21:53:23.463" LastActivityDate="2017-07-10T08:16:25.887" Title="Using separate functions for Project Euler 1" Tags="&lt;python&gt;&lt;programming-challenge&gt;" AnswerCount="10" CommentCount="0" ContentLicense="CC BY-SA 3.0" />
async function parseXMLFile(filePath) {
    try {
      const xmlData = fs.readFileSync(filePath, 'utf-8');
      const parser = new xml2js.Parser({ 
        explicitArray: false,
        mergeAttrs: true
      });
      
      return new Promise((resolve, reject) => {
        parser.parseString(xmlData, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    } catch (error) {
      Logger.error('Error llegint o analitzant el fitxer XML:', error);
      throw error;
    }
}

function decodeHTMLEntities(text) {
    // Method for Node.js environment using a simple regex-based approach
    return text.replace(/&#x([0-9A-F]+);/gi, (match, hex) => {
        return String.fromCharCode(parseInt(hex, 16));
      })
      // Handle decimal entities (like &#60;)
      .replace(/&#(\d+);/g, (match, dec) => {
        return String.fromCharCode(dec);
      })
      // Handle named entities
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&nbsp;/g, ' ');
  }

function processData(data) {
    // Make sure we have data to process
    if (!data.posts.row || !Array.isArray(data.posts.row)) {
        Logger.error('Invalid data: Expected an array');
      return [];
    }
    // Use map correctly to transform each row
    return data.posts.row.map(row => {
      // Return the transformed object directly
        return {
            "Id": parseInt(row.Id) || 0,
            "PostTypeId": parseInt(row.PostTypeId) || 1,
            "AcceptedAnswerId": parseInt(row.AcceptedAnswerId) || 0,
            "CreationDate": row.CreationDate || new Date().toISOString(),
            "Score": parseInt(row.Score) || 0,
            "ViewCount": parseInt(row.ViewCount) || 0,
            "Body": decodeHTMLEntities(row.Body || ""),
            "OwnerUserId": parseInt(row.OwnerUserId) || 0,
            "LastActivityDate": row.LastActivityDate || new Date().toISOString(),
            "Title": row.Title || "",
            "Tags": row.Tags || "",
            "AnswerCount": parseInt(row.AnswerCount) || 0,
            "CommentCount": parseInt(row.CommentCount) || 0,
            "ContentLicense": row.ContentLicense || "CC BY-SA 2.5"
        };
    });
  }

async function loadDataToMongoDB() {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        Logger.log('Connectat a MongoDB');
        
        const database = client.db('post_db');
        const collection = database.collection('posts');
        
        Logger.log('Llegint el fitxer XML...');
        const xmlData = await parseXMLFile(xmlFilePath);
        
        Logger.log('Processant les dades...');
        const youtubers = processData(xmlData);
        
        Logger.log('Eliminant dades existents...');
        await collection.deleteMany({});

        Logger.log('Inserint dades a MongoDB...');
        const result = await collection.insertMany(youtubers);
        
        Logger.log(`${result.insertedCount} documents inserits correctament.`);
        Logger.log('Dades carregades amb èxit!');
        
    } catch (error) {
        Logger.error('Error carregant les dades a MongoDB:', error);
    } finally {
        await client.close();
        Logger.log('Connexió a MongoDB tancada');
    }
}

loadDataToMongoDB();