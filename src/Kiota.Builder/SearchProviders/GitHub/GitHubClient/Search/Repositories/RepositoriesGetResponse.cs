// <auto-generated/>
#pragma warning disable CS0618
using Kiota.Builder.SearchProviders.GitHub.GitHubClient.Models;
using Microsoft.Kiota.Abstractions.Extensions;
using Microsoft.Kiota.Abstractions.Serialization;
using System.Collections.Generic;
using System.IO;
using System;
namespace Kiota.Builder.SearchProviders.GitHub.GitHubClient.Search.Repositories
{
    [global::System.CodeDom.Compiler.GeneratedCode("Kiota", "1.0.0")]
    #pragma warning disable CS1591
    public partial class RepositoriesGetResponse : IAdditionalDataHolder, IParsable
    #pragma warning restore CS1591
    {
        /// <summary>Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.</summary>
        public IDictionary<string, object> AdditionalData { get; set; }
        /// <summary>The incomplete_results property</summary>
        public bool? IncompleteResults { get; set; }
        /// <summary>The items property</summary>
#if NETSTANDARD2_1_OR_GREATER || NETCOREAPP3_1_OR_GREATER
#nullable enable
        public List<global::Kiota.Builder.SearchProviders.GitHub.GitHubClient.Models.RepoSearchResultItem>? Items { get; set; }
#nullable restore
#else
        public List<global::Kiota.Builder.SearchProviders.GitHub.GitHubClient.Models.RepoSearchResultItem> Items { get; set; }
#endif
        /// <summary>The total_count property</summary>
        public int? TotalCount { get; set; }
        /// <summary>
        /// Instantiates a new <see cref="global::Kiota.Builder.SearchProviders.GitHub.GitHubClient.Search.Repositories.RepositoriesGetResponse"/> and sets the default values.
        /// </summary>
        public RepositoriesGetResponse()
        {
            AdditionalData = new Dictionary<string, object>();
        }
        /// <summary>
        /// Creates a new instance of the appropriate class based on discriminator value
        /// </summary>
        /// <returns>A <see cref="global::Kiota.Builder.SearchProviders.GitHub.GitHubClient.Search.Repositories.RepositoriesGetResponse"/></returns>
        /// <param name="parseNode">The parse node to use to read the discriminator value and create the object</param>
        public static global::Kiota.Builder.SearchProviders.GitHub.GitHubClient.Search.Repositories.RepositoriesGetResponse CreateFromDiscriminatorValue(IParseNode parseNode)
        {
            _ = parseNode ?? throw new ArgumentNullException(nameof(parseNode));
            return new global::Kiota.Builder.SearchProviders.GitHub.GitHubClient.Search.Repositories.RepositoriesGetResponse();
        }
        /// <summary>
        /// The deserialization information for the current model
        /// </summary>
        /// <returns>A IDictionary&lt;string, Action&lt;IParseNode&gt;&gt;</returns>
        public virtual IDictionary<string, Action<IParseNode>> GetFieldDeserializers()
        {
            return new Dictionary<string, Action<IParseNode>>
            {
                { "incomplete_results", n => { IncompleteResults = n.GetBoolValue(); } },
                { "items", n => { Items = n.GetCollectionOfObjectValues<global::Kiota.Builder.SearchProviders.GitHub.GitHubClient.Models.RepoSearchResultItem>(global::Kiota.Builder.SearchProviders.GitHub.GitHubClient.Models.RepoSearchResultItem.CreateFromDiscriminatorValue)?.AsList(); } },
                { "total_count", n => { TotalCount = n.GetIntValue(); } },
            };
        }
        /// <summary>
        /// Serializes information the current object
        /// </summary>
        /// <param name="writer">Serialization writer to use to serialize this model</param>
        public virtual void Serialize(ISerializationWriter writer)
        {
            _ = writer ?? throw new ArgumentNullException(nameof(writer));
            writer.WriteBoolValue("incomplete_results", IncompleteResults);
            writer.WriteCollectionOfObjectValues<global::Kiota.Builder.SearchProviders.GitHub.GitHubClient.Models.RepoSearchResultItem>("items", Items);
            writer.WriteIntValue("total_count", TotalCount);
            writer.WriteAdditionalData(AdditionalData);
        }
    }
}
#pragma warning restore CS0618
