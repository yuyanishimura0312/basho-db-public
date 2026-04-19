export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <p className="text-xs tracking-[0.3em] text-stone-400 mb-2 uppercase">About</p>
      <h1 className="font-serif text-4xl md:text-5xl text-stone-900 mb-8 leading-tight">
        場所性とは何か
      </h1>

      <div className="prose prose-stone prose-lg max-w-none">
        <p className="text-xl text-stone-600 leading-relaxed mb-8">
          「場所性（basho-sei）」とは、ある場所が持つ歴史的・文化的な固有の意味の深さを指す概念です。
          単なる物理的空間としての立地ではなく、そこで営まれてきた文化的実践、
          積み重ねられた時間、地域との結びつきが生み出す、場所そのものの力を意味します。
        </p>

        <h2 className="font-serif text-2xl text-stone-900 mt-12 mb-4">理論的基盤</h2>

        <h3 className="font-serif text-xl text-stone-800 mt-8 mb-3">西田幾多郎の「場所」</h3>
        <p>
          日本の哲学者・西田幾多郎（1870-1945）は、西洋哲学の主語的論理に対して
          「述語的論理」を提唱しました。西田の「場所」は物理的空間ではなく、
          存在が成立するための根拠となる「場」です。
          優れた場所とは、訪問者の存在を全体的に包み込み、
          その人のための場として機能することにあります。
        </p>

        <h3 className="font-serif text-xl text-stone-800 mt-8 mb-3">ブルデューの文化資本</h3>
        <p>
          フランスの社会学者ピエール・ブルデューは、文化的資源が社会的に機能する仕組みを明らかにしました。
          飲食店や宿泊施設においては、職人の技術（身体化された文化資本）、
          建築や調度品（客体化された文化資本）、文化財指定（制度化された文化資本）として
          場所性が具現化されます。
        </p>

        <h3 className="font-serif text-xl text-stone-800 mt-8 mb-3">現象学的場所論</h3>
        <p>
          エドワード・レルフは「場所のアイデンティティ」を物理的設定・活動・意味の三要素で捉え、
          没場所性（placelessness）— 均質化されたチェーン店的空間 — を批判しました。
          イーフー・トゥアンは「トポフィリア」（場所への愛着）の概念を通じて、
          空間が経験を通じて意味ある場所へと変容する過程を描きました。
        </p>

        <h2 className="font-serif text-2xl text-stone-900 mt-12 mb-6">8軸の評価フレームワーク</h2>

        <div className="not-prose space-y-4">
          {[
            { num: 1, name: "歴史的継続性", desc: "その場所で営みが継続してきた時間の長さと、歴史が重層的に堆積している度合い。パリンプセスト（重層的歴史）の概念。" },
            { num: 2, name: "文化的営みの深度", desc: "伝統技法の継承、職人的身体知の蓄積、文化的実践の独自性。ブルデューの身体化された文化資本。" },
            { num: 3, name: "地域的固有性", desc: "地元の素材・食材の使用、地域の風土との関係、地域コミュニティとの結びつき。トゥアンのトポフィリア。" },
            { num: 4, name: "物質的文化財性", desc: "建築様式の歴史的価値、文化財指定の有無、空間デザインや調度品の文化的価値。客体化された文化資本。" },
            { num: 5, name: "場所の内側性", desc: "訪問者がその場所に包まれていると感じる度合い。空間の親密性、雰囲気、五感への訴え。レルフのinsideness。" },
            { num: 6, name: "文化的複雑性", desc: "複数の文化的伝統の融合・対話。和洋の交差、異なる時代の要素の共存、文化的文脈の重なりの豊かさ。" },
            { num: 7, name: "ナラティブ性", desc: "場所にまつわる逸話・伝説、著名人との関わり、場所自体が語りかける物語性。場所の感覚(sense of place)。" },
            { num: 8, name: "本物性", desc: "文化的表現が商業的演出ではなく内在的な必然性に基づいている度合い。レルフのauthentic place。" },
          ].map((axis) => (
            <div key={axis.num} className="flex gap-4 p-4 bg-stone-50 border border-stone-200 rounded-lg">
              <span className="font-serif text-2xl text-stone-400 shrink-0 w-8">{axis.num}</span>
              <div>
                <h4 className="font-serif text-lg text-stone-900 mb-1">{axis.name}</h4>
                <p className="text-sm text-stone-600 leading-relaxed">{axis.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="font-serif text-2xl text-stone-900 mt-12 mb-4">このサイトについて</h2>
        <p>
          Bashoは、トレンドや口コミ評価ではなく、歴史と文化に根ざした「場所性」という
          新しい軸で日本の飲食店・宿泊施設を発見するためのマッチングサイトです。
          AIエージェントが8軸のフレームワークに基づいて各施設の場所性を評価し、
          あなたが求める場所性を持つ施設との出会いを実現します。
        </p>

        <div className="not-prose mt-12 p-6 bg-miratuku-pale-peach/20 rounded-lg border border-[var(--color-border)]">
          <h3 className="font-serif text-xl text-[var(--color-accent)] mb-3">場所性レポート</h3>
          <p className="text-sm text-[var(--color-text-muted)] mb-4">
            場所性の理論的基盤について、西田幾多郎、ブルデュー、トゥアン、レルフなどの
            学術的知見を統合した10,000字の詳細レポートをお読みいただけます。
          </p>
          <a
            href="/report-bashosei.html"
            className="inline-block bg-[var(--color-accent)] text-white px-6 py-2.5 text-sm rounded hover:bg-[var(--color-accent-light)] transition-colors"
          >
            レポートを読む
          </a>
        </div>
      </div>
    </div>
  );
}
